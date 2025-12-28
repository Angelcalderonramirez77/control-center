const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Factor de coste para el hashing

// Validar formato de cédula dominicana: XXX-XXXXXXX-X
const validateCedula = (cedula) => {
    const cedulaRegex = /^\d{3}-\d{7}-\d$/;
    return cedulaRegex.test(cedula);
};

// --- Rutas de la API para Empleados ---

// GET /api/employees - Obtener todos los empleados con detalles
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT e.cedula as id, e.name, e.salary::NUMERIC as salary, r.name as role,
                   e.start_date, e.position, e.daily_wage::NUMERIC as daily_wage,
                   e.hours_per_day
            FROM employees e
            JOIN roles r ON e.role_id = r.id
            ORDER BY e.cedula ASC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error en GET /api/employees:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/employees - Añadir un nuevo empleado
router.post('/', async (req, res) => {
    const { id, name, password, role, salary, start_date, position, daily_wage, hours_per_day } = req.body;
    try {
        if (!id || !name || !password || !role || !salary) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        
        // Validar formato de cédula
        if (!validateCedula(id)) {
            return res.status(400).json({ error: 'Formato de cédula inválido. Usar formato: 000-0000000-0' });
        }
        
        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = `
            INSERT INTO employees (cedula, name, password, role_id, salary, start_date, position, daily_wage, hours_per_day)
            VALUES ($1, $2, $3, (SELECT id FROM roles WHERE name = $4), $5, $6, $7, $8, $9)
            RETURNING cedula as id, name, salary::NUMERIC as salary, (SELECT name FROM roles WHERE id = role_id) as role,
                      start_date, position, daily_wage::NUMERIC as daily_wage, hours_per_day;
        `;
        const result = await db.query(query, [
            id, name, hashedPassword, role, salary, 
            start_date || new Date().toISOString().split('T')[0],
            position || 'Empleado',
            daily_wage || (salary / 22),
            hours_per_day || 8
        ]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error en POST /api/employees:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/employees/:id - Actualizar un empleado
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, role, salary, password, position, daily_wage, hours_per_day, start_date } = req.body;
    try {
        let query;
        let params;
        if (password) {
            // Si se proporciona una nueva contraseña, hashearla antes de actualizar
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            query = `
                UPDATE employees
                SET name = $1, role_id = (SELECT id FROM roles WHERE name = $2), salary = $3, password = $4,
                    position = $5, daily_wage = $6, hours_per_day = $7, start_date = $8
                WHERE cedula = $9
                RETURNING cedula as id, name, salary::NUMERIC as salary, (SELECT name FROM roles WHERE id = role_id) as role,
                          position, daily_wage::NUMERIC as daily_wage, hours_per_day, start_date;
            `;
            params = [name, role, salary, hashedPassword, position, daily_wage, hours_per_day, start_date || new Date().toISOString().split('T')[0], id];
        } else {
            query = `
                UPDATE employees
                SET name = $1, role_id = (SELECT id FROM roles WHERE name = $2), salary = $3,
                    position = $4, daily_wage = $5, hours_per_day = $6, start_date = $7
                WHERE cedula = $8
                RETURNING cedula as id, name, salary::NUMERIC as salary, (SELECT name FROM roles WHERE id = role_id) as role,
                          position, daily_wage::NUMERIC as daily_wage, hours_per_day, start_date;
            `;
            params = [name, role, salary, position, daily_wage, hours_per_day, start_date || new Date().toISOString().split('T')[0], id];
        }
        const result = await db.query(query, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error en PUT /api/employees/:id:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/employees/:id - Eliminar un empleado
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM employees WHERE cedula = $1', [id]);
        res.status(204).send(); // No content
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/employees/:id/income - Obtener ingresos de un empleado
router.get('/:id/income', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT di.id, di.employee_id, di.income_date, 
                   di.amount::NUMERIC as amount, di.hours_worked
            FROM daily_income di
            WHERE di.employee_id = $1
            ORDER BY di.income_date DESC
            LIMIT 30
        `;
        const result = await db.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error en GET /api/employees/:id/income:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/employees/:id/details - Obtener detalles completos de un empleado
router.get('/:id/details', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT e.cedula as id, e.name, e.salary::NUMERIC as salary, r.name as role,
                   e.start_date, e.position, e.daily_wage::NUMERIC as daily_wage,
                   e.hours_per_day,
                   COUNT(di.id) as total_income_records,
                   COALESCE(SUM(di.amount), 0)::NUMERIC as total_income,
                   AVG(di.hours_worked)::NUMERIC as avg_hours_worked
            FROM employees e
            JOIN roles r ON e.role_id = r.id
            LEFT JOIN daily_income di ON e.cedula = di.employee_id
            WHERE e.cedula = $1
            GROUP BY e.cedula, e.name, e.salary, r.name, e.start_date, e.position, 
                     e.daily_wage, e.hours_per_day
        `;
        const result = await db.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error en GET /api/employees/:id/details:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
