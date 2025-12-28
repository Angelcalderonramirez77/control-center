const db = require('./db');
const bcrypt = require('bcrypt');

async function setPasswords() {
    try {
        const saltRounds = 10;
        
        // Contraseña estándar para todos: "password" (o puedes cambiarla)
        const defaultPassword = 'password123';
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
        
        console.log('\n===== ACTUALIZANDO CONTRASEÑAS DE EMPLEADOS =====\n');
        
        const result = await db.query('SELECT cedula, name FROM employees');
        
        for (const emp of result.rows) {
            await db.query('UPDATE employees SET password = $1 WHERE cedula = $2', [hashedPassword, emp.cedula]);
            console.log(`✅ ${emp.name} (${emp.cedula}) - Contraseña: ${defaultPassword}`);
        }
        
        console.log('\n✅ Todas las contraseñas han sido actualizadas correctamente');
        console.log(`Contraseña estándar: "${defaultPassword}"\n`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

setPasswords();
