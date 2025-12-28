const express = require('express');
const router = express.Router();
const db = require('../db');
const Decimal = require('decimal.js');
const winston = require('winston');

// Configurar logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/payments.log' })
    ]
});

// =====================================================
// RUTAS DE PAGOS
// =====================================================

/**
 * POST /api/payments/register
 * Registrar un pago
 */
router.post('/register', async (req, res) => {
    try {
        const { employeeCedula, paymentDate, salaryAmount, bonus = 0, deductions = 0, paymentMethod, adminCedula } = req.body;

        if (!employeeCedula || !paymentDate || !salaryAmount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const netAmount = new Decimal(salaryAmount).plus(bonus).minus(deductions);

        const result = await db.query(
            `INSERT INTO payment_history 
            (employee_cedula, payment_date, salary_amount, bonus, deductions, net_amount, payment_method, status, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'PAGADO', $8)
            RETURNING *`,
            [employeeCedula, paymentDate, salaryAmount, bonus, deductions, netAmount.toString(), paymentMethod || 'TRANSFERENCIA', adminCedula]
        );

        logger.info(`Payment registered for ${employeeCedula}`, result.rows[0]);

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        logger.error('Error registering payment:', error);
        res.status(500).json({ error: 'Failed to register payment', message: error.message });
    }
});

/**
 * GET /api/payments/history
 * Obtener historial de pagos con filtros
 * Normaliza cédulas removiendo guiones
 */
router.get('/history', async (req, res) => {
    try {
        const { startDate, endDate, employeeCedula, limit = 100, offset = 0 } = req.query;

        let query = 'SELECT * FROM payment_history WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (startDate) {
            query += ` AND payment_date >= $${paramCount}`;
            params.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND payment_date <= $${paramCount}`;
            params.push(endDate);
            paramCount++;
        }

        if (employeeCedula) {
            // Normalizar cédula: si no tiene guiones, agregarlos
            let normalizedCedula = employeeCedula;
            if (employeeCedula && !employeeCedula.includes('-')) {
                // Formato: XXX-XXXXXXX-X
                normalizedCedula = employeeCedula.slice(0, 3) + '-' + employeeCedula.slice(3, 10) + '-' + employeeCedula.slice(10);
            }
            query += ` AND employee_cedula = $${paramCount}`;
            params.push(normalizedCedula);
            paramCount++;
        }

        query += ` ORDER BY payment_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        res.json({ success: true, data: result.rows, total: result.rowCount });
    } catch (error) {
        logger.error('Error fetching payment history:', error);
        res.status(500).json({ error: 'Failed to fetch payment history', message: error.message });
    }
});

// =====================================================
// RUTAS DE RETENCIONES
// =====================================================

/**
 * POST /api/payroll/calculate
 * Calcular retenciones (ISR, AFP, SFS)
 * Basado en República Dominicana 2025
 */
router.post('/calculate', async (req, res) => {
    try {
        const { employeeCedula, salaryAmount, paymentId } = req.body;

        if (!salaryAmount) {
            return res.status(400).json({ error: 'Missing salary amount' });
        }

        const salary = new Decimal(salaryAmount);
        
        // RETENCIONES DOMINICANAS 2025 (Ley 87-01 y normativas vigentes)
        // AFP: 2.87% (Sistema de Pensiones)
        const afp = salary.times('0.0287');
        
        // SFS: 1.00% (Seguro de Salud)
        const sfs = salary.times('0.01');
        
        // ISR: Depende del rango salarial
        // Hasta 150,000: 0%
        // 150,001 a 400,000: 15%
        // 400,001 a 800,000: 20%
        // Más de 800,000: 25%
        let isr = new Decimal(0);
        if (salary.greaterThan(800000)) {
            isr = salary.times('0.25');
        } else if (salary.greaterThan(400000)) {
            isr = salary.times('0.20');
        } else if (salary.greaterThan(150000)) {
            isr = salary.times('0.15');
        }

        const totalWithholdings = afp.plus(sfs).plus(isr);

        // Si viene paymentId, guardar en BD
        if (paymentId) {
            await db.query(
                `INSERT INTO withholdings (employee_cedula, payment_id, isr, afp, sfs, total_withholdings, calculation_date)
                VALUES ($1, $2, $3, $4, $5, $6, NOW())
                RETURNING *`,
                [employeeCedula || 'UNKNOWN', paymentId, isr.toString(), afp.toString(), sfs.toString(), totalWithholdings.toString()]
            );
        }

        res.status(201).json({ 
            success: true, 
            summary: {
                salary: salary.toFixed(2),
                afp: afp.toFixed(2),
                sfs: sfs.toFixed(2),
                isr: isr.toFixed(2),
                totalWithholdings: totalWithholdings.toFixed(2),
                net: salary.minus(totalWithholdings).toFixed(2)
            }
        });
    } catch (error) {
        logger.error('Error calculating withholdings:', error);
        res.status(500).json({ error: 'Failed to calculate withholdings', message: error.message });
    }
});

/**
 * GET /api/withholdings/:employeeCedula
 * Obtener retenciones de un empleado
 */
router.get('/:employeeCedula', async (req, res) => {
    try {
        const { employeeCedula } = req.params;
        const { limit = 12, offset = 0 } = req.query;

        const result = await db.query(
            `SELECT * FROM withholdings 
            WHERE employee_cedula = $1
            ORDER BY calculation_date DESC
            LIMIT $2 OFFSET $3`,
            [employeeCedula, limit, offset]
        );

        res.json({ success: true, data: result.rows, total: result.rowCount });
    } catch (error) {
        logger.error('Error fetching withholdings:', error);
        res.status(500).json({ error: 'Failed to fetch withholdings', message: error.message });
    }
});

// =====================================================
// RUTAS DE BONIFICACIONES Y DEDUCCIONES
// =====================================================

/**
 * POST /api/bonuses-deductions
 * Agregar bonificación o deducción
 */
router.post('/', async (req, res) => {
    try {
        const { 
            employeeCedula, type, description, amount, effectiveDate, 
            endDate, reason, approvedBy 
        } = req.body;

        if (!employeeCedula || !type || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await db.query(
            `INSERT INTO bonuses_deductions 
            (employee_cedula, type, description, amount, effective_date, end_date, reason, approved_by, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ACTIVO')
            RETURNING *`,
            [employeeCedula, type, description, amount, effectiveDate, endDate || null, reason || null, approvedBy]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        logger.error('Error creating bonus/deduction:', error);
        res.status(500).json({ error: 'Failed to create bonus/deduction', message: error.message });
    }
});

/**
 * GET /api/bonuses-deductions/:employeeCedula
 * Obtener bonificaciones y deducciones de un empleado
 */
router.get('/:employeeCedula', async (req, res) => {
    try {
        const { employeeCedula } = req.params;
        const { status = 'ACTIVO' } = req.query;

        const result = await db.query(
            `SELECT * FROM bonuses_deductions 
            WHERE employee_cedula = $1 AND status = $2
            ORDER BY effective_date DESC`,
            [employeeCedula, status]
        );

        res.json({ success: true, data: result.rows, total: result.rowCount });
    } catch (error) {
        logger.error('Error fetching bonuses/deductions:', error);
        res.status(500).json({ error: 'Failed to fetch bonuses/deductions', message: error.message });
    }
});

/**
 * PUT /api/bonuses-deductions/:id
 * Actualizar bonificación o deducción
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, endDate } = req.body;

        const result = await db.query(
            `UPDATE bonuses_deductions 
            SET status = $1, end_date = $2, updated_at = NOW()
            WHERE id = $3
            RETURNING *`,
            [status || 'ACTIVO', endDate || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bonus/Deduction not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        logger.error('Error updating bonus/deduction:', error);
        res.status(500).json({ error: 'Failed to update bonus/deduction', message: error.message });
    }
});

// =====================================================
// RUTAS DE PROYECCIÓN DE NÓMINA
// =====================================================

/**
 * POST /api/payroll/project
 * Simular costo de nómina futura
 */
router.post('/project', async (req, res) => {
    try {
        const { month } = req.body;

        if (!month) {
            return res.status(400).json({ error: 'Month parameter is required' });
        }

        // Obtener todos los empleados activos
        const employees = await db.query(`
            SELECT cedula, salary, daily_wage FROM employees 
            WHERE is_active = true
        `);

        // Obtener bonificaciones y deducciones activas
        const bonusesDeductions = await db.query(`
            SELECT employee_cedula, SUM(CASE WHEN type = 'BONUS' THEN amount ELSE -amount END) as total
            FROM bonuses_deductions
            WHERE status = 'ACTIVO' 
            AND (end_date IS NULL OR end_date >= $1)
            AND effective_date <= $1
            GROUP BY employee_cedula
        `, [month + '-01']);

        let totalPayroll = new Decimal(0);
        let totalWithholdings = new Decimal(0);
        let projectedData = [];

        employees.rows.forEach(emp => {
            let salary = new Decimal(emp.salary);
            
            // Buscar bonificaciones/deducciones
            const bd = bonusesDeductions.rows.find(b => b.employee_cedula === emp.cedula);
            if (bd) {
                salary = salary.plus(bd.total);
            }

            // RETENCIONES DOMINICANAS 2025
            // AFP: 2.87% (Sistema de Pensiones - Ley 87-01)
            const afp = salary.times('0.0287');
            
            // SFS: 1.00% (Seguro de Salud - Ley 87-01)
            const sfs = salary.times('0.01');
            
            // ISR: Depende del rango salarial
            // Hasta 150,000: 0%
            // 150,001 a 400,000: 15%
            // 400,001 a 800,000: 20%
            // Más de 800,000: 25%
            let isr = new Decimal(0);
            if (salary.greaterThan(800000)) {
                isr = salary.times('0.25');
            } else if (salary.greaterThan(400000)) {
                isr = salary.times('0.20');
            } else if (salary.greaterThan(150000)) {
                isr = salary.times('0.15');
            }

            const withholdings = afp.plus(sfs).plus(isr);
            const net = salary.minus(withholdings);

            totalPayroll = totalPayroll.plus(salary);
            totalWithholdings = totalWithholdings.plus(withholdings);

            projectedData.push({
                cedula: emp.cedula,
                salary: salary.toFixed(2),
                withholdings: withholdings.toFixed(2),
                net: net.toFixed(2)
            });
        });

        res.json({
            success: true,
            month,
            summary: {
                employeeCount: employees.rowCount,
                totalPayroll: totalPayroll.toFixed(2),
                totalWithholdings: totalWithholdings.toFixed(2),
                netCost: totalPayroll.minus(totalWithholdings).toFixed(2)
            },
            details: projectedData
        });
    } catch (error) {
        logger.error('Error projecting payroll:', error);
        res.status(500).json({ error: 'Failed to project payroll', message: error.message });
    }
});

module.exports = router;
