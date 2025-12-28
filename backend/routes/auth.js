const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// POST /api/auth/login - Autenticación de usuario
router.post('/login', async (req, res) => {
    const { employeeId, password } = req.body;
    try {
        if (!employeeId || !password) {
            return res.status(400).json({ error: 'Faltan credenciales' });
        }
        
        // Normalizar cédula: agregar guiones si no los tiene
        let normalizedCedula = employeeId;
        if (employeeId && !employeeId.includes('-')) {
            // Formato: XXX-XXXXXXX-X (11 dígitos sin guiones)
            if (employeeId.length === 11) {
                normalizedCedula = employeeId.slice(0, 3) + '-' + employeeId.slice(3, 10) + '-' + employeeId.slice(10);
            }
        }
        
        // Primero, obtener el usuario por su cédula para recuperar la contraseña hasheada
        const userQuery = `
            SELECT e.cedula as id, e.name, e.password, e.salary::NUMERIC as salary, r.name as role
            FROM employees e
            JOIN roles r ON e.role_id = r.id
            WHERE e.cedula = $1
        `;
        const userResult = await db.query(userQuery, [normalizedCedula]);

        if (userResult.rows.length === 0) {
            // Si no se encuentra el usuario, las credenciales son incorrectas
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const user = userResult.rows[0];

        // Comparar la contraseña proporcionada con el hash almacenado
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // La contraseña coincide, login exitoso
            // No enviar el hash de la contraseña de vuelta al cliente
            delete user.password;
            res.json(user);
        } else {
            // La contraseña no coincide
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    } catch (err) {
        console.error('Error en POST /api/auth/login:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
