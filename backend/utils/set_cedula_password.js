const db = require('./db');
const bcrypt = require('bcrypt');

async function setCedulaAsPassword() {
    try {
        const saltRounds = 10;
        
        console.log('\n===== ACTUALIZANDO CONTRASEÑAS CON CÉDULA SIN GUIONES =====\n');
        
        const result = await db.query('SELECT cedula, name FROM employees ORDER BY cedula');
        
        for (const emp of result.rows) {
            // Convertir cédula con guiones a sin guiones
            const cedulaSinGuiones = emp.cedula.replace(/-/g, '');
            const hashedPassword = await bcrypt.hash(cedulaSinGuiones, saltRounds);
            
            await db.query('UPDATE employees SET password = $1 WHERE cedula = $2', [hashedPassword, emp.cedula]);
            console.log(`✅ ${emp.name}`);
            console.log(`   Cédula: ${emp.cedula}`);
            console.log(`   Contraseña: ${cedulaSinGuiones}\n`);
        }
        
        console.log('✅ Todas las contraseñas han sido actualizadas');
        console.log('✅ Ahora la contraseña es la cédula SIN GUIONES\n');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

setCedulaAsPassword();
