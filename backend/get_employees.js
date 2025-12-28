const db = require('./db');

async function getEmployees() {
    try {
        const result = await db.query('SELECT cedula, name FROM employees ORDER BY cedula');
        console.log('\n===== EMPLEADOS DISPONIBLES =====\n');
        result.rows.forEach(e => {
            console.log(`Cédula: ${e.cedula} | Nombre: ${e.name}`);
        });
        console.log(`\nTotal: ${result.rows.length} empleados\n`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

getEmployees();
