const express = require('express');
const router = express.Router();
const db = require('../db');

// --- Rutas de la API para Gráficos ---

// GET /api/charts/salary-distribution - Datos para el gráfico de distribución de salarios
router.get('/salary-distribution', async (req, res) => {
    try {
        const result = await db.query('SELECT salary::NUMERIC as salary FROM employees');
        const salaries = result.rows.map(r => parseFloat(r.salary));

        const salaryRanges = {
            '5k-15k': 0,
            '15k-25k': 0,
            '25k-40k': 0,
            '40k+': 0,
        };

        salaries.forEach(salary => {
            if (salary < 15000) salaryRanges['5k-15k']++;
            else if (salary < 25000) salaryRanges['15k-25k']++;
            else if (salary < 40000) salaryRanges['25k-40k']++;
            else salaryRanges['40k+']++;
        });

        res.json(salaryRanges);
    } catch (err) {
        console.error('Error en GET /api/charts/salary-distribution:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/charts/monthly-profits - Datos para el gráfico de ganancias mensuales
router.get('/monthly-profits', async (req, res) => {
    try {
        const result = await db.query('SELECT month, profit::NUMERIC as profit FROM monthly_profits ORDER BY id ASC');
        if (result.rows.length === 0) {
            // Retornar datos vacíos si no hay registros
            return res.json([]);
        }
        res.json(result.rows);
    } catch (err) {
        console.error('Error en GET /api/charts/monthly-profits:', err);
        // Si la tabla no existe, retornar datos vacíos
        res.json([]);
    }
});

module.exports = router;
