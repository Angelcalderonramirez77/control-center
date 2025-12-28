const express = require('express');
const router = express.Router();
const db = require('../db');
const winston = require('winston');

// Configurar logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// =====================================================
// RUTAS DE DEPARTAMENTOS
// =====================================================

/**
 * GET /api/departments
 * Obtener todos los departamentos
 */
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM departments ORDER BY name');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        logger.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
});

/**
 * POST /api/departments
 * Crear nuevo departamento
 */
router.post('/', async (req, res) => {
    try {
        const { name, description, adminCedula } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Department name is required' });
        }

        const result = await db.query(
            'INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *',
            [name, description || null]
        );

        // Log de auditoría
        await logAudit(adminCedula, null, 'CREATE', 'departments', null, result.rows[0]);

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        logger.error('Error creating department:', error);
        res.status(500).json({ error: 'Failed to create department', message: error.message });
    }
});

/**
 * PUT /api/departments/:id
 * Actualizar departamento
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, adminCedula } = req.body;

        // Obtener datos anteriores
        const oldData = await db.query('SELECT * FROM departments WHERE id = $1', [id]);
        if (oldData.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        const result = await db.query(
            'UPDATE departments SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
            [name || oldData.rows[0].name, description !== undefined ? description : oldData.rows[0].description, id]
        );

        // Log de auditoría
        await logAudit(adminCedula, null, 'UPDATE', 'departments', oldData.rows[0], result.rows[0]);

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        logger.error('Error updating department:', error);
        res.status(500).json({ error: 'Failed to update department', message: error.message });
    }
});

/**
 * DELETE /api/departments/:id
 * Eliminar departamento
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { adminCedula } = req.body;

        const oldData = await db.query('SELECT * FROM departments WHERE id = $1', [id]);
        if (oldData.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        await db.query('DELETE FROM departments WHERE id = $1', [id]);

        // Log de auditoría
        await logAudit(adminCedula, null, 'DELETE', 'departments', oldData.rows[0], null);

        res.json({ success: true, message: 'Department deleted successfully' });
    } catch (error) {
        logger.error('Error deleting department:', error);
        res.status(500).json({ error: 'Failed to delete department', message: error.message });
    }
});

// =====================================================
// RUTAS DE GESTIÓN AVANZADA DE EMPLEADOS
// =====================================================

/**
 * GET /api/admin/employees/advanced-filter
 * Filtros avanzados de empleados
 */
router.get('/advanced-filter', async (req, res) => {
    try {
        const { 
            roleId, departmentId, salaryMin, salaryMax, 
            startDateFrom, startDateTo, isActive = true,
            limit = 50, offset = 0 
        } = req.query;

        let query = `
            SELECT e.*, r.name as role_name, d.name as department_name
            FROM employees e
            LEFT JOIN roles r ON e.role_id = r.id
            LEFT JOIN departments d ON e.department_id = d.id
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        if (roleId) {
            query += ` AND e.role_id = $${paramCount}`;
            params.push(roleId);
            paramCount++;
        }

        if (departmentId) {
            query += ` AND e.department_id = $${paramCount}`;
            params.push(departmentId);
            paramCount++;
        }

        if (salaryMin) {
            query += ` AND e.salary >= $${paramCount}`;
            params.push(salaryMin);
            paramCount++;
        }

        if (salaryMax) {
            query += ` AND e.salary <= $${paramCount}`;
            params.push(salaryMax);
            paramCount++;
        }

        if (startDateFrom) {
            query += ` AND e.start_date >= $${paramCount}`;
            params.push(startDateFrom);
            paramCount++;
        }

        if (startDateTo) {
            query += ` AND e.start_date <= $${paramCount}`;
            params.push(startDateTo);
            paramCount++;
        }

        query += ` AND e.is_active = $${paramCount}`;
        params.push(isActive === 'true');
        paramCount++;

        query += ` ORDER BY e.name LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        res.json({ success: true, data: result.rows, total: result.rowCount });
    } catch (error) {
        logger.error('Error in advanced filter:', error);
        res.status(500).json({ error: 'Failed to filter employees', message: error.message });
    }
});

/**
 * POST /api/admin/employees/bulk-update
 * Editar múltiples empleados a la vez
 */
router.post('/bulk-update', async (req, res) => {
    try {
        const { employeeCedulas, updates, adminCedula } = req.body;

        if (!employeeCedulas || !Array.isArray(employeeCedulas) || employeeCedulas.length === 0) {
            return res.status(400).json({ error: 'Employee cédulas array is required' });
        }

        const updateFields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(updates).forEach(key => {
            if (['salary', 'daily_wage', 'role_id', 'department_id', 'position'].includes(key)) {
                updateFields.push(`${key} = $${paramCount}`);
                values.push(updates[key]);
                paramCount++;
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        values.push(employeeCedulas);
        const query = `
            UPDATE employees 
            SET ${updateFields.join(', ')}, updated_at = NOW()
            WHERE cedula = ANY($${paramCount})
            RETURNING *
        `;

        const result = await db.query(query, values);

        // Log de auditoría para cada empleado actualizado
        result.rows.forEach(emp => {
            logAudit(adminCedula, emp.cedula, 'UPDATE', 'employees', null, emp);
        });

        res.json({ success: true, updated: result.rowCount, data: result.rows });
    } catch (error) {
        logger.error('Error in bulk update:', error);
        res.status(500).json({ error: 'Failed to bulk update employees', message: error.message });
    }
});

/**
 * POST /api/admin/employees/:cedula/deactivate
 * Desactivar empleado
 */
router.post('/:cedula/deactivate', async (req, res) => {
    try {
        const { cedula } = req.params;
        const { adminCedula, reason } = req.body;

        const oldData = await db.query('SELECT * FROM employees WHERE cedula = $1', [cedula]);
        if (oldData.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const result = await db.query(
            'UPDATE employees SET is_active = false, updated_at = NOW() WHERE cedula = $1 RETURNING *',
            [cedula]
        );

        await logAudit(adminCedula, cedula, 'UPDATE', 'employees', 
            { is_active: true }, 
            { is_active: false, reason }
        );

        res.json({ success: true, message: 'Employee deactivated', data: result.rows[0] });
    } catch (error) {
        logger.error('Error deactivating employee:', error);
        res.status(500).json({ error: 'Failed to deactivate employee', message: error.message });
    }
});

// =====================================================
// FUNCIÓN AUXILIAR DE AUDITORÍA
// =====================================================

async function logAudit(adminCedula, employeeCedula, action, tableName, oldValues, newValues) {
    try {
        const changesDescription = action === 'UPDATE' 
            ? Object.keys(newValues || {}).filter(k => oldValues[k] !== newValues[k]).join(', ')
            : null;

        await db.query(
            `INSERT INTO audit_log (admin_cedula, employee_cedula, action, table_name, old_values, new_values, changes_description, changed_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
            [
                adminCedula || null,
                employeeCedula || null,
                action,
                tableName,
                JSON.stringify(oldValues),
                JSON.stringify(newValues),
                changesDescription
            ]
        );
    } catch (error) {
        logger.error('Error logging audit:', error);
    }
}

module.exports = router;
