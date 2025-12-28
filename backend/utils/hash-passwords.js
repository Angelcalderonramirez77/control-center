const bcrypt = require('bcrypt');
const db = require('./db');

const saltRounds = 10;

// Datos de empleados con sus contraseñas en texto plano
const employeesData = [
    { id: '1001', password: 'password123' },
    { id: '2002', password: 'adminpassword' },
    { id: '1003', password: 'testuser' },
    { id: '1004', password: 'password456' }
];

async function hashAndUpdatePasswords() {
    try {
        for (const employee of employeesData) {
            const hashedPassword = await bcrypt.hash(employee.password, saltRounds);
            console.log(`ID: ${employee.id}`);
            console.log(`Password original: ${employee.password}`);
            console.log(`Password hasheada: ${hashedPassword}`);
            
            // Actualizar en la BD
            await db.query(
                'UPDATE employees SET password = $1 WHERE id = $2',
                [hashedPassword, employee.id]
            );
            console.log(`✓ Contraseña actualizada para ${employee.id}\n`);
        }
        
        console.log('✅ Todas las contraseñas han sido hasheadas y actualizadas.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

hashAndUpdatePasswords();
