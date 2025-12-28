const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Decimal = require('decimal.js');
const db = require('../db');
const path = require('path');

// =====================================================
// RUTAS DE REPORTES
// =====================================================

/**
 * GET /api/reports/payroll-pdf?month=2025-01
 * Generar PDF de nómina mensual
 */
router.get('/payroll-pdf', async (req, res) => {
    try {
        const { month, employeeCedula } = req.query;
        
        if (!month) {
            return res.status(400).json({ error: 'Month parameter is required' });
        }

        // Obtener datos de pagos del mes
        let query = `
            SELECT 
                e.cedula, e.name, e.position, e.salary,
                ph.payment_date, ph.salary_amount, ph.bonus, ph.deductions, ph.net_amount,
                w.isr, w.afp, w.sfs
            FROM payment_history ph
            JOIN employees e ON ph.employee_cedula = e.cedula
            LEFT JOIN withholdings w ON w.payment_id = ph.id
            WHERE DATE_TRUNC('month', ph.payment_date) = $1::date
            ORDER BY e.name
        `;
        
        const params = [month + '-01'];
        
        if (employeeCedula) {
            query += ` AND e.cedula = $2`;
            params.push(employeeCedula);
        }

        const result = await db.query(query, params);
        const payments = result.rows;

        if (payments.length === 0) {
            return res.status(404).json({ error: 'No payroll data found for this period' });
        }

        // Crear PDF
        const doc = new PDFDocument({
            size: 'A4',
            margin: 40,
            bufferPages: true
        });

        // Headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="nomina_${month}.pdf"`);
        doc.pipe(res);

        // Título
        doc.fontSize(18).font('Helvetica-Bold').text('REPORTE DE NÓMINA', { align: 'center' });
        doc.fontSize(12).text('Control Center Pro', { align: 'center' });
        doc.fontSize(10).text(`Mes: ${month}`, { align: 'center' });
        doc.moveDown(1);

        // Tabla de datos
        const tableTop = doc.y;
        const pageWidth = doc.page.width - 80;
        const colWidths = {
            cedula: 100,
            name: 130,
            position: 100,
            salary: 80,
            bonus: 70,
            deductions: 70,
            net: 80
        };

        // Headers de tabla
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Cédula', 40, tableTop);
        doc.text('Nombre', 140, tableTop);
        doc.text('Puesto', 270, tableTop);
        doc.text('Salario', 370, tableTop);
        doc.text('Bonos', 450, tableTop);
        doc.text('Desc.', 520, tableTop);

        // Línea separadora
        doc.moveTo(40, tableTop + 20).lineTo(pageWidth + 40, tableTop + 20).stroke();

        // Datos de empleados
        let yPosition = tableTop + 35;
        let totalSalary = new Decimal(0);
        let totalBonus = new Decimal(0);
        let totalDeductions = new Decimal(0);
        let totalNet = new Decimal(0);

        doc.fontSize(8).font('Helvetica');
        payments.forEach(payment => {
            if (yPosition > 750) {
                doc.addPage();
                yPosition = 40;
                doc.fontSize(9).font('Helvetica-Bold');
                doc.text('Cédula', 40, yPosition);
                doc.text('Nombre', 140, yPosition);
                doc.text('Puesto', 270, yPosition);
                doc.text('Salario', 370, yPosition);
                doc.text('Bonos', 450, yPosition);
                doc.text('Desc.', 520, yPosition);
                doc.moveTo(40, yPosition + 20).lineTo(pageWidth + 40, yPosition + 20).stroke();
                yPosition += 35;
                doc.fontSize(8).font('Helvetica');
            }

            doc.text(payment.cedula, 40, yPosition, { width: colWidths.cedula });
            doc.text(payment.name, 140, yPosition, { width: colWidths.name });
            doc.text(payment.position || '', 270, yPosition, { width: colWidths.position });
            doc.text(formatCurrency(payment.salary_amount), 370, yPosition, { width: colWidths.salary, align: 'right' });
            doc.text(formatCurrency(payment.bonus || 0), 450, yPosition, { width: colWidths.bonus, align: 'right' });
            doc.text(formatCurrency(payment.deductions || 0), 520, yPosition, { width: colWidths.deductions, align: 'right' });

            totalSalary = totalSalary.plus(payment.salary_amount);
            totalBonus = totalBonus.plus(payment.bonus || 0);
            totalDeductions = totalDeductions.plus(payment.deductions || 0);
            totalNet = totalNet.plus(payment.net_amount);

            yPosition += 20;
        });

        // Totales
        yPosition += 10;
        doc.moveTo(40, yPosition).lineTo(pageWidth + 40, yPosition).stroke();
        yPosition += 15;
        
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('TOTALES:', 40, yPosition);
        doc.text(formatCurrency(parseFloat(totalSalary.toString())), 370, yPosition, { width: colWidths.salary, align: 'right' });
        doc.text(formatCurrency(parseFloat(totalBonus.toString())), 450, yPosition, { width: colWidths.bonus, align: 'right' });
        doc.text(formatCurrency(parseFloat(totalDeductions.toString())), 520, yPosition, { width: colWidths.deductions, align: 'right' });

        // Información de retenciones
        yPosition += 40;
        doc.fontSize(10).font('Helvetica-Bold').text('Resumen de Retenciones:', 40, yPosition);
        yPosition += 20;
        doc.fontSize(9).font('Helvetica');

        const totalISR = payments.reduce((sum, p) => sum + (parseFloat(p.isr) || 0), 0);
        const totalAFP = payments.reduce((sum, p) => sum + (parseFloat(p.afp) || 0), 0);
        const totalSFS = payments.reduce((sum, p) => sum + (parseFloat(p.sfs) || 0), 0);

        doc.text(`ISR (Impuesto sobre la Renta): ${formatCurrency(totalISR)}`);
        doc.text(`AFP (Fondo de Pensión): ${formatCurrency(totalAFP)}`);
        doc.text(`SFS (Seguro Familiar Salud): ${formatCurrency(totalSFS)}`);
        const totalWithholdings = totalISR + totalAFP + totalSFS;
        doc.text(`Total Retenciones: ${formatCurrency(totalWithholdings)}`);

        doc.fontSize(8).text(`\nGenerado el: ${new Date().toLocaleString('es-DO')}`, 40, doc.y + 20);

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF', message: error.message });
    }
});

/**
 * GET /api/reports/payroll-excel?month=2025-01
 * Exportar nómina a Excel
 */
router.get('/payroll-excel', async (req, res) => {
    try {
        const { month } = req.query;
        
        if (!month) {
            return res.status(400).json({ error: 'Month parameter is required' });
        }

        const result = await db.query(`
            SELECT 
                e.cedula, e.name, e.position, e.salary,
                ph.payment_date, ph.salary_amount, ph.bonus, ph.deductions, ph.net_amount,
                w.isr, w.afp, w.sfs
            FROM payment_history ph
            JOIN employees e ON ph.employee_cedula = e.cedula
            LEFT JOIN withholdings w ON w.payment_id = ph.id
            WHERE DATE_TRUNC('month', ph.payment_date) = $1::date
            ORDER BY e.name
        `, [month + '-01']);

        const payments = result.rows;

        if (payments.length === 0) {
            return res.status(404).json({ error: 'No payroll data found' });
        }

        // Crear workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Nómina');

        // Headers
        worksheet.columns = [
            { header: 'Cédula', key: 'cedula', width: 15 },
            { header: 'Nombre', key: 'name', width: 30 },
            { header: 'Puesto', key: 'position', width: 20 },
            { header: 'Salario Base', key: 'salary_amount', width: 15 },
            { header: 'Bonos', key: 'bonus', width: 12 },
            { header: 'ISR', key: 'isr', width: 12 },
            { header: 'AFP', key: 'afp', width: 12 },
            { header: 'SFS', key: 'sfs', width: 12 },
            { header: 'Descuentos', key: 'deductions', width: 12 },
            { header: 'Neto', key: 'net_amount', width: 15 }
        ];

        // Estilos de header
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667eea' } };

        // Agregar datos
        payments.forEach(payment => {
            worksheet.addRow({
                cedula: payment.cedula,
                name: payment.name,
                position: payment.position || '',
                salary_amount: payment.salary_amount,
                bonus: payment.bonus || 0,
                isr: payment.isr || 0,
                afp: payment.afp || 0,
                sfs: payment.sfs || 0,
                deductions: payment.deductions || 0,
                net_amount: payment.net_amount
            });
        });

        // Formato de moneda
        ['D', 'E', 'F', 'G', 'H', 'I', 'J'].forEach(col => {
            worksheet.getColumn(col).numFmt = '[$$-2C09]#,##0.00;-[$$-2C09]#,##0.00';
        });

        // Descargar
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="nomina_${month}.xlsx"`);
        
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({ error: 'Failed to generate Excel', message: error.message });
    }
});

/**
 * GET /api/reports/audit-log?limit=100&offset=0
 * Ver historial de cambios (auditoría)
 */
router.get('/audit-log', async (req, res) => {
    try {
        const { limit = 50, offset = 0, employeeCedula, actionType, startDate, endDate } = req.query;

        let query = `
            SELECT 
                al.id,
                al.action,
                al.table_name,
                al.admin_cedula,
                e_admin.name as admin_name,
                al.employee_cedula,
                e_emp.name as employee_name,
                al.changes_description,
                al.changed_at,
                al.ip_address
            FROM audit_log al
            LEFT JOIN employees e_admin ON al.admin_cedula = e_admin.cedula
            LEFT JOIN employees e_emp ON al.employee_cedula = e_emp.cedula
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        if (employeeCedula) {
            query += ` AND al.employee_cedula = $${paramCount}`;
            params.push(employeeCedula);
            paramCount++;
        }

        if (actionType) {
            query += ` AND al.action = $${paramCount}`;
            params.push(actionType);
            paramCount++;
        }

        if (startDate) {
            query += ` AND al.changed_at >= $${paramCount}`;
            params.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND al.changed_at <= $${paramCount}`;
            params.push(endDate);
            paramCount++;
        }

        query += ` ORDER BY al.changed_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        res.json({
            success: true,
            data: result.rows,
            total: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching audit log:', error);
        res.status(500).json({ error: 'Failed to fetch audit log', message: error.message });
    }
});

/**
 * GET /api/reports/payment-history?startDate=2025-01-01&endDate=2025-01-31
 * Obtener historial de pagos por rango de fechas
 */
router.get('/payment-history', async (req, res) => {
    try {
        const { startDate, endDate, employeeCedula } = req.query;

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
            query += ` AND employee_cedula = $${paramCount}`;
            params.push(employeeCedula);
            paramCount++;
        }

        query += ` ORDER BY payment_date DESC`;

        const result = await db.query(query, params);

        res.json({
            success: true,
            data: result.rows,
            total: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ error: 'Failed to fetch payment history', message: error.message });
    }
});

/**
 * GET /api/reports/payment-history/:cedula
 * Historial de pagos de un empleado específico
 */
router.get('/payment-history/:cedula', async (req, res) => {
    try {
        const { cedula } = req.params;
        const { limit = 12, offset = 0 } = req.query;

        const result = await db.query(`
            SELECT 
                ph.id, ph.employee_cedula, ph.payment_date, ph.salary_amount, 
                ph.bonus, ph.deductions, ph.net_amount, ph.payment_method, ph.status,
                w.isr, w.afp, w.sfs
            FROM payment_history ph
            LEFT JOIN withholdings w ON w.payment_id = ph.id
            WHERE ph.employee_cedula = $1
            ORDER BY ph.payment_date DESC
            LIMIT $2 OFFSET $3
        `, [cedula, limit, offset]);

        res.json({
            success: true,
            data: result.rows,
            total: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ error: 'Failed to fetch payment history', message: error.message });
    }
});

/**
 * POST /api/reports/project-payroll
 * Proyectar nómina futura considerando bonos y deducciones
 */
router.post('/project-payroll', async (req, res) => {
    try {
        const { month } = req.body;
        
        if (!month) {
            return res.status(400).json({ error: 'Month parameter is required' });
        }

        // Obtener todos los empleados activos
        const employees = await db.query(
            `SELECT cedula, name, salary FROM employees WHERE is_active = true ORDER BY name`
        );

        // Obtener bonificaciones y deducciones activas
        const bonusesDeductions = await db.query(
            `SELECT employee_cedula, amount FROM bonuses_deductions 
            WHERE status = 'ACTIVO' 
            AND effective_date <= $1::date 
            AND (end_date IS NULL OR end_date >= $1::date)`,
            [month + '-01']
        );

        let totalPayroll = new Decimal(0);
        let totalWithholdings = new Decimal(0);
        const details = [];

        employees.rows.forEach(emp => {
            const salary = new Decimal(emp.salary);
            
            // Calcular bonos y deducciones para este empleado
            const empBonuses = bonusesDeductions.rows
                .filter(bd => bd.employee_cedula === emp.cedula)
                .reduce((sum, bd) => sum.plus(bd.amount), new Decimal(0));

            const totalSalary = salary.plus(empBonuses);
            
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
            const net = totalSalary.minus(withholdings);

            details.push({
                cedula: emp.cedula,
                name: emp.name,
                salary: totalSalary.toFixed(2),
                withholdings: withholdings.toFixed(2),
                net: net.toFixed(2)
            });

            totalPayroll = totalPayroll.plus(totalSalary);
            totalWithholdings = totalWithholdings.plus(withholdings);
        });

        const netCost = totalPayroll.minus(totalWithholdings);

        res.json({
            success: true,
            summary: {
                employeeCount: employees.rows.length,
                totalPayroll: totalPayroll.toFixed(2),
                totalWithholdings: totalWithholdings.toFixed(2),
                netCost: netCost.toFixed(2)
            },
            details: details
        });
    } catch (error) {
        console.error('Error projecting payroll:', error);
        res.status(500).json({ error: 'Failed to project payroll', message: error.message });
    }
});

/**
 * GET /api/reports/salary-growth
 * Análisis de crecimiento salarial entre dos meses
 */
router.get('/salary-growth', async (req, res) => {
    try {
        const { startMonth, endMonth } = req.query;

        if (!startMonth || !endMonth) {
            return res.status(400).json({ 
                error: 'startMonth and endMonth parameters are required' 
            });
        }

        // Si son los mismos meses, retornar un análisis del mes
        if (startMonth === endMonth) {
            const payments = await db.query(`
                SELECT 
                    ph.employee_cedula,
                    e.name,
                    ph.salary_amount,
                    ph.bonus,
                    ph.deductions,
                    ph.net_amount,
                    w.isr,
                    w.afp,
                    w.sfs
                FROM payment_history ph
                JOIN employees e ON ph.employee_cedula = e.cedula
                LEFT JOIN withholdings w ON ph.id = w.payment_id
                WHERE TO_CHAR(ph.payment_date, 'YYYY-MM') = $1
                ORDER BY e.name
            `, [startMonth]);

            if (payments.rows.length === 0) {
                return res.json({
                    success: true,
                    message: `No hay registros de pago para ${startMonth}`,
                    data: []
                });
            }

            const analysis = payments.rows.map(p => ({
                cedula: p.employee_cedula,
                name: p.name,
                salary: parseFloat(p.salary_amount),
                bonus: parseFloat(p.bonus || 0),
                deductions: parseFloat(p.deductions || 0),
                isr: parseFloat(p.isr || 0),
                afp: parseFloat(p.afp || 0),
                sfs: parseFloat(p.sfs || 0),
                net: parseFloat(p.net_amount)
            }));

            return res.json({
                success: true,
                period: `${startMonth}`,
                totalRecords: payments.rows.length,
                data: analysis
            });
        }

        // Comparación entre dos meses diferentes
        const startPayments = await db.query(`
            SELECT 
                ph.employee_cedula,
                e.name,
                AVG(ph.salary_amount) as avg_salary
            FROM payment_history ph
            JOIN employees e ON ph.employee_cedula = e.cedula
            WHERE TO_CHAR(ph.payment_date, 'YYYY-MM') = $1
            GROUP BY ph.employee_cedula, e.name
        `, [startMonth]);

        const endPayments = await db.query(`
            SELECT 
                ph.employee_cedula,
                e.name,
                AVG(ph.salary_amount) as avg_salary
            FROM payment_history ph
            JOIN employees e ON ph.employee_cedula = e.cedula
            WHERE TO_CHAR(ph.payment_date, 'YYYY-MM') = $1
            GROUP BY ph.employee_cedula, e.name
        `, [endMonth]);

        const analysis = startPayments.rows.map(start => {
            const end = endPayments.rows.find(e => e.employee_cedula === start.employee_cedula);
            const startSalary = parseFloat(start.avg_salary);
            const endSalary = end ? parseFloat(end.avg_salary) : startSalary;
            const difference = endSalary - startSalary;
            const percentageChange = startSalary > 0 ? (difference / startSalary * 100).toFixed(2) : 0;

            return {
                cedula: start.employee_cedula,
                name: start.name,
                startSalary,
                endSalary,
                difference,
                percentageChange
            };
        });

        res.json({
            success: true,
            period: `${startMonth} hasta ${endMonth}`,
            data: analysis
        });

    } catch (error) {
        console.error('Error fetching salary growth:', error);
        res.status(500).json({ error: 'Failed to fetch salary growth', message: error.message });
    }
});

// Función auxiliar para formatear moneda
function formatCurrency(value) {
    if (!value || value === null || value === undefined) return '0.00';
    try {
        const numValue = parseFloat(String(value).replace(/,/g, ''));
        if (isNaN(numValue)) return '0.00';
        const num = new Decimal(numValue);
        return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } catch (e) {
        console.error('Error in formatCurrency:', value, e);
        return '0.00';
    }
}

module.exports = router;
