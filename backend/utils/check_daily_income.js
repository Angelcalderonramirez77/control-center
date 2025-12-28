const db = require('./db');

async function checkDailyIncome() {
    try {
        const cedula = '404-5555555-5'; // Luisa Martínez
        
        console.log('\n===== REGISTROS DE INGRESO DIARIO =====');
        console.log(`Empleada: Luisa Martínez (${cedula})\n`);
        
        // Verificar en daily_income
        const result = await db.query(
            `SELECT di.id, di.income_date, di.hours_worked, di.amount::NUMERIC as amount
             FROM daily_income di
             WHERE di.employee_id = $1
             ORDER BY di.income_date DESC
             LIMIT 20`,
            [cedula]
        );
        
        if (result.rows.length === 0) {
            console.log('❌ NO HAY REGISTROS en la tabla daily_income');
        } else {
            console.log(`✅ ENCONTRADOS ${result.rows.length} registros:\n`);
            result.rows.forEach(row => {
                console.log(`Fecha: ${row.income_date} | Horas: ${row.hours_worked} | Monto: RD$${row.amount}`);
            });
        }
        
        // Verificar si la tabla daily_income existe y tiene datos
        const tableCheck = await db.query(`
            SELECT COUNT(*) as total FROM daily_income
        `);
        
        console.log(`\nTotal de registros en daily_income: ${tableCheck.rows[0].total}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkDailyIncome();
