const { Pool } = require('pg');
const Decimal = require('decimal.js');

const pool = new Pool({
    user: 'postgres',
    password: 'Yescanny402',
    host: 'localhost',
    port: 5432,
    database: 'nomina_db'
});

async function insertPaymentRecord() {
    const client = await pool.connect();
    try {
        // Buscar el empleado
        const employeeResult = await client.query(
            'SELECT cedula, name, salary FROM employees WHERE cedula = $1',
            ['402-0047666-7']
        );

        if (employeeResult.rows.length === 0) {
            console.log('❌ Empleado no encontrado');
            return;
        }

        const employee = employeeResult.rows[0];
        console.log(`✅ Empleado encontrado: ${employee.name}`);

        const basicSalary = parseFloat(employee.salary);
        const paymentDate = '2025-12-25';
        const netAmount = basicSalary;

        // Insertar registro de pago
        const paymentResult = await client.query(
            `INSERT INTO payment_history 
            (employee_cedula, payment_date, salary_amount, bonus, deductions, net_amount, payment_method, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            RETURNING id`,
            [employee.cedula, paymentDate, basicSalary, 0, 0, netAmount, 'TRANSFERENCIA', 'PAGADO']
        );

        const paymentId = paymentResult.rows[0].id;
        console.log(`✅ Registro de pago creado con ID: ${paymentId}`);

        // RETENCIONES DOMINICANAS 2025
        // AFP: 2.87% (Sistema de Pensiones - Ley 87-01)
        const afp = new Decimal(basicSalary).times(0.0287).toNumber();
        
        // SFS: 1.00% (Seguro de Salud - Ley 87-01)
        const sfs = new Decimal(basicSalary).times(0.01).toNumber();
        
        // ISR: Depende del rango salarial
        let isr = 0;
        if (basicSalary > 800000) {
            isr = new Decimal(basicSalary).times(0.25).toNumber();
        } else if (basicSalary > 400000) {
            isr = new Decimal(basicSalary).times(0.20).toNumber();
        } else if (basicSalary > 150000) {
            isr = new Decimal(basicSalary).times(0.15).toNumber();
        }
        
        const totalWithholdings = afp + sfs + isr;

        // Insertar retenciones
        await client.query(
            `INSERT INTO withholdings 
            (employee_cedula, payment_id, isr, afp, sfs, total_withholdings, calculation_date, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
            [employee.cedula, paymentId, isr, afp, sfs, totalWithholdings, paymentDate]
        );

        console.log(`✅ Retenciones registradas:`);
        console.log(`   - ISR: $${isr.toFixed(2)}`);
        console.log(`   - AFP: $${afp.toFixed(2)}`);
        console.log(`   - SFS: $${sfs.toFixed(2)}`);
        console.log(`   - Total: $${totalWithholdings.toFixed(2)}`);

        console.log(`\n✅ Registro de pago para DICIEMBRE 2025 creado exitosamente`);
        console.log(`   Empleado: ${employee.name}`);
        console.log(`   Cédula: 402-0047666-7`);
        console.log(`   Salario Bruto: $${basicSalary.toFixed(2)}`);
        console.log(`   Fecha: 25/12/2025`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.release();
        pool.end();
    }
}

insertPaymentRecord();
