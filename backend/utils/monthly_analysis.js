const { Pool } = require('pg');
const Decimal = require('decimal.js');

const pool = new Pool({
    user: 'postgres',
    password: 'Yescanny402',
    host: 'localhost',
    port: 5432,
    database: 'nomina_db'
});

async function generateMonthlyAnalysis(month) {
    const client = await pool.connect();
    try {
        console.log(`\n📊 ANÁLISIS DE NÓMINA - ${month}\n`);
        console.log('='.repeat(70));

        // Obtener todos los pagos del mes
        const paymentsQuery = `
            SELECT 
                ph.id,
                ph.employee_cedula,
                e.name,
                ph.payment_date,
                ph.salary_amount,
                ph.bonus,
                ph.deductions,
                ph.net_amount,
                w.isr,
                w.afp,
                w.sfs,
                w.total_withholdings
            FROM payment_history ph
            JOIN employees e ON ph.employee_cedula = e.cedula
            LEFT JOIN withholdings w ON ph.id = w.payment_id
            WHERE TO_CHAR(ph.payment_date, 'YYYY-MM') = $1
            ORDER BY ph.payment_date DESC
        `;

        const result = await client.query(paymentsQuery, [month]);
        const payments = result.rows;

        if (payments.length === 0) {
            console.log(`❌ No hay registros de pago para ${month}`);
            return;
        }

        console.log(`\n📋 RESUMEN POR EMPLEADO:\n`);
        
        let totalSalaries = 0;
        let totalBonuses = 0;
        let totalDeductions = 0;
        let totalISR = 0;
        let totalAFP = 0;
        let totalSFS = 0;
        let totalWithholdings = 0;
        let totalNet = 0;

        payments.forEach((payment, index) => {
            const salary = parseFloat(payment.salary_amount);
            const bonus = parseFloat(payment.bonus || 0);
            const deductions = parseFloat(payment.deductions || 0);
            const isr = parseFloat(payment.isr || 0);
            const afp = parseFloat(payment.afp || 0);
            const sfs = parseFloat(payment.sfs || 0);
            const withholdings = parseFloat(payment.total_withholdings || 0);
            const net = parseFloat(payment.net_amount);

            totalSalaries += salary;
            totalBonuses += bonus;
            totalDeductions += deductions;
            totalISR += isr;
            totalAFP += afp;
            totalSFS += sfs;
            totalWithholdings += withholdings;
            totalNet += net;

            console.log(`${index + 1}. ${payment.name} (${payment.employee_cedula})`);
            console.log(`   Salario Base: $${salary.toFixed(2).padStart(12)}`);
            if (bonus > 0) console.log(`   Bonificación: $${bonus.toFixed(2).padStart(12)}`);
            if (deductions > 0) console.log(`   Deducciones:  $${deductions.toFixed(2).padStart(12)}`);
            console.log(`   ─────────────────────────────`);
            console.log(`   Retenciones (Dominicanas 2025):`);
            console.log(`     • ISR: $${isr.toFixed(2).padStart(10)} (${salary > 800000 ? '25%' : salary > 400000 ? '20%' : salary > 150000 ? '15%' : '0%'})`);
            console.log(`     • AFP: $${afp.toFixed(2).padStart(10)} (2.87%)`);
            console.log(`     • SFS: $${sfs.toFixed(2).padStart(10)} (1.00%)`);
            console.log(`   Total Retenciones: $${withholdings.toFixed(2).padStart(8)}`);
            console.log(`   ─────────────────────────────`);
            console.log(`   Neto a Pagar: $${net.toFixed(2).padStart(12)}`);
            console.log();
        });

        console.log('='.repeat(70));
        console.log(`\n💰 TOTALES DEL MES ${month}:\n`);
        console.log(`Total Empleados:       ${payments.length}`);
        console.log(`Salarios Base:         $${totalSalaries.toFixed(2).padStart(12)}`);
        console.log(`Bonificaciones:        $${totalBonuses.toFixed(2).padStart(12)}`);
        console.log(`Deducciones:           $${totalDeductions.toFixed(2).padStart(12)}`);
        console.log(`\n📌 RETENCIONES TOTALES:`);
        console.log(`   ISR:                 $${totalISR.toFixed(2).padStart(12)}`);
        console.log(`   AFP:                 $${totalAFP.toFixed(2).padStart(12)}`);
        console.log(`   SFS:                 $${totalSFS.toFixed(2).padStart(12)}`);
        console.log(`   ─────────────────────────────`);
        console.log(`   Total Retenciones:   $${totalWithholdings.toFixed(2).padStart(12)}`);
        console.log(`\n💵 MASA SALARIAL NETA: $${totalNet.toFixed(2).padStart(12)}`);
        console.log('='.repeat(70));

        // Estadísticas
        const avgSalary = totalSalaries / payments.length;
        const avgWithholdings = totalWithholdings / payments.length;
        const witholdingPercentage = (totalWithholdings / totalSalaries * 100).toFixed(2);

        console.log(`\n📈 ESTADÍSTICAS:\n`);
        console.log(`Salario Promedio:      $${avgSalary.toFixed(2)}`);
        console.log(`Retención Promedio:    $${avgWithholdings.toFixed(2)}`);
        console.log(`% Retención del Total: ${witholdingPercentage}%`);
        console.log(`\n✅ Análisis completado exitosamente`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.release();
        pool.end();
    }
}

// Usar el mes actual o uno especificado
const month = process.argv[2] || '2025-12';
generateMonthlyAnalysis(month);
