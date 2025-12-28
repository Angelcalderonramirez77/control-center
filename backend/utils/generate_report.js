const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const Decimal = require('decimal.js');

const CEDULA = '402-0047666-7';
const MONTH = '2025-01';

async function generateTestReport() {
    try {
        console.log('\n📌 Generando reporte para cédula:', CEDULA);
        console.log('📅 Mes:', MONTH);
        
        // 1. Obtener datos del empleado
        console.log('\n🔍 Obteniendo datos del empleado...');
        const empResult = await db.query(
            'SELECT * FROM employees WHERE cedula = $1',
            [CEDULA]
        );
        
        if (empResult.rows.length === 0) {
            console.error('❌ No se encontró empleado con cédula:', CEDULA);
            process.exit(1);
        }
        
        const employee = empResult.rows[0];
        console.log('✅ Empleado encontrado:', employee.name);
        
        // 2. Obtener pagos del mes
        console.log('\n💰 Obteniendo pagos del mes...');
        const paymentsResult = await db.query(`
            SELECT 
                ph.id, ph.employee_cedula, ph.payment_date, 
                ph.salary_amount, ph.bonus, ph.deductions, ph.net_amount,
                w.isr, w.afp, w.sfs
            FROM payment_history ph
            LEFT JOIN withholdings w ON w.payment_id = ph.id
            WHERE ph.employee_cedula = $1 
            AND DATE_TRUNC('month', ph.payment_date) = $2::date
        `, [CEDULA, MONTH + '-01']);
        
        if (paymentsResult.rows.length === 0) {
            console.error('❌ No hay pagos para este mes');
            
            // Insertar un pago de prueba
            console.log('\n📌 Insertando pago de prueba...');
            const salary = 55000;
            const bonus = 5000;
            const deductions = 0;
            const net = salary + bonus - deductions;
            
            const insertResult = await db.query(`
                INSERT INTO payment_history 
                (employee_cedula, payment_date, salary_amount, bonus, deductions, net_amount, payment_method, status, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, 'TRANSFERENCIA', 'PAGADO', $1)
                RETURNING *
            `, [CEDULA, MONTH + '-15', salary, bonus, deductions, net]);
            
            const paymentId = insertResult.rows[0].id;
            console.log('✅ Pago insertado con ID:', paymentId);
            
            // Insertar retenciones
            const isr = salary * 0.15;
            const afp = salary * 0.025;
            const sfs = salary * 0.0287;
            
            await db.query(`
                INSERT INTO withholdings 
                (payment_id, employee_cedula, isr, afp, sfs, total_withholdings, calculation_date)
                VALUES ($1, $2, $3, $4, $5, $6, NOW())
            `, [paymentId, CEDULA, isr, afp, sfs, isr + afp + sfs]);
            
            console.log('✅ Retenciones calculadas');
        }
        
        // 3. Obtener datos completos para el reporte
        const finalResult = await db.query(`
            SELECT 
                ph.id, e.name, e.cedula, e.position, e.salary,
                ph.employee_cedula, ph.payment_date, 
                ph.salary_amount, ph.bonus, ph.deductions, ph.net_amount,
                w.isr, w.afp, w.sfs
            FROM payment_history ph
            JOIN employees e ON ph.employee_cedula = e.cedula
            LEFT JOIN withholdings w ON w.payment_id = ph.id
            WHERE ph.employee_cedula = $1 
            AND DATE_TRUNC('month', ph.payment_date) = $2::date
        `, [CEDULA, MONTH + '-01']);
        
        const payments = finalResult.rows;
        
        if (payments.length === 0) {
            console.error('❌ Aún no hay datos');
            process.exit(1);
        }
        
        console.log('✅ Datos obtenidos:', payments.length, 'registros');
        
        // 4. Generar PDF
        console.log('\n📄 Generando PDF...');
        
        const outputPath = path.join(__dirname, '..', `reporte_${CEDULA.replace(/-/g, '_')}_${MONTH}.pdf`);
        
        const doc = new PDFDocument({
            size: 'A4',
            margin: 40,
            bufferPages: true
        });
        
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);
        
        // Contenido del PDF
        doc.fontSize(18).font('Helvetica-Bold').text('REPORTE DE NÓMINA', { align: 'center' });
        doc.fontSize(12).text('Control Center Pro', { align: 'center' });
        doc.fontSize(10).text(`Mes: ${MONTH} | Empleado: ${CEDULA}`, { align: 'center' });
        doc.moveDown(1);
        
        // Datos del empleado
        doc.fontSize(11).font('Helvetica-Bold').text('Datos del Empleado:');
        doc.fontSize(10).font('Helvetica');
        doc.text(`Cédula: ${payments[0].cedula}`);
        doc.text(`Nombre: ${payments[0].name}`);
        doc.text(`Puesto: ${payments[0].position || 'N/A'}`);
        doc.text(`Salario Base: RD$ ${formatCurrency(payments[0].salary)}`);
        doc.moveDown(0.5);
        
        // Tabla de pagos
        doc.fontSize(11).font('Helvetica-Bold').text('Detalle de Pago:');
        doc.moveDown(0.3);
        
        const tableTop = doc.y;
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Concepto', 40, tableTop);
        doc.text('Monto (RD$)', 300, tableTop, { align: 'right' });
        
        doc.moveTo(40, tableTop + 20).lineTo(550, tableTop + 20).stroke();
        
        let yPos = tableTop + 35;
        doc.fontSize(9).font('Helvetica');
        
        const p = payments[0];
        const items = [
            { label: 'Salario Base', value: p.salary_amount },
            { label: 'Bonos', value: p.bonus || 0 },
            { label: 'Descuentos', value: p.deductions || 0 },
            { label: '', value: null }, // Línea separadora
            { label: 'ISR (Impuesto Renta)', value: p.isr || 0 },
            { label: 'AFP (Fondo Pensión)', value: p.afp || 0 },
            { label: 'SFS (Seguro Salud)', value: p.sfs || 0 },
            { label: '', value: null }, // Línea separadora
            { label: 'TOTAL NETO', value: p.net_amount },
        ];
        
        items.forEach(item => {
            if (item.value === null) {
                doc.moveTo(40, yPos).lineTo(550, yPos).stroke();
            } else if (item.label === 'TOTAL NETO') {
                doc.font('Helvetica-Bold');
                doc.text(item.label, 40, yPos);
                doc.text(formatCurrency(item.value), 300, yPos, { width: 250, align: 'right' });
                doc.font('Helvetica');
            } else {
                doc.text(item.label, 40, yPos);
                doc.text(formatCurrency(item.value), 300, yPos, { width: 250, align: 'right' });
            }
            yPos += 20;
        });
        
        doc.moveDown(1);
        doc.fontSize(8).text(`Generado: ${new Date().toLocaleString('es-DO')}`);
        doc.text('Este es un documento de prueba generado internamente.');
        
        doc.end();
        
        stream.on('finish', () => {
            console.log('✅ PDF generado exitosamente');
            console.log(`📁 Ubicación: ${outputPath}`);
            console.log('\n✨ ¡Reporte listo!');
            process.exit(0);
        });
        
        stream.on('error', (err) => {
            console.error('❌ Error al generar PDF:', err);
            process.exit(1);
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

function formatCurrency(value) {
    if (!value) return '0.00';
    const num = new Decimal(value);
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

generateTestReport();
