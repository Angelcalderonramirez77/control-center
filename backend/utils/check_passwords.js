const db = require('./db');
const bcrypt = require('bcrypt');

async function checkEmployees() {
    try {
        const result = await db.query('SELECT cedula, name, password FROM employees ORDER BY cedula');
        
        console.log('\n===== EMPLEADOS Y SUS CONTRASEÑAS =====\n');
        
        for (const emp of result.rows) {
            console.log(`Cédula: ${emp.cedula}`);
            console.log(`Nombre: ${emp.name}`);
            console.log(`Hash: ${emp.password.substring(0, 30)}...`);
            
            // Probar contraseñas comunes
            const testPasswords = ['password', '123456', 'admin', emp.name.toLowerCase(), 'employee'];
            console.log('Probando contraseñas comunes...');
            
            for (const pwd of testPasswords) {
                const match = await bcrypt.compare(pwd, emp.password);
                if (match) {
                    console.log(`   ✅ CONTRASEÑA CORRECTA: "${pwd}"`);
                    break;
                }
            }
            console.log('');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkEmployees();
