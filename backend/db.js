const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a la base de datos usando variables de entorno
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'nomina_db',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Evento de conexión exitosa
pool.on('connect', () => {
    console.log('Conectado a la base de datos.');
});

// Evento de error de conexión
pool.on('error', (err) => {
    console.error('Error inesperado en la base de datos:', err);
});

// Exportar el pool para que pueda ser utilizado en otras partes de la aplicación
module.exports = {
    query: (text, params) => pool.query(text, params),
}
