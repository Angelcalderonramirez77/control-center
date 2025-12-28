const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'nomina_db',
    password: 'Yescanny402',
    port: 5432,
});

async function testConnection() {
    let client;
    try {
        console.log('🔍 Intentando conectar a la base de datos...');
        client = await pool.connect();
        
        // Consulta de prueba
        const res = await client.query('SELECT NOW() as current_time');
        console.log('✅ Conexión exitosa a PostgreSQL');
        console.log('📅 Hora actual de la base de datos:', res.rows[0].current_time);
        
        // Verificar si la tabla employees existe
        const tableCheck = await client.query(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employees')"
        );
        console.log('📊 ¿Tabla employees existe?', tableCheck.rows[0].exists);
        
    } catch (err) {
        console.error('❌ Error al conectar a la base de datos:');
        console.error(err);
        
        // Mensajes de error comunes
        if (err.code === 'ECONNREFUSED') {
            console.error('\n⚠️  No se pudo conectar al servidor PostgreSQL. Verifica que:');
            console.error('1. PostgreSQL esté instalado y en ejecución');
            console.error('2. El puerto 5432 esté abierto y disponible');
            console.error('3. Las credenciales en db.js sean correctas');
        } else if (err.code === '3D000') { // database does not exist
            console.error('\n⚠️  La base de datos no existe. ¿Ejecutaste el script init.sql?');
        } else if (err.code === '28P01') { // password authentication failed
            console.error('\n⚠️  Error de autenticación. Verifica el usuario y contraseña en db.js');
        }
        
    } finally {
        if (client) {
            client.release();
        }
        pool.end();
    }
}

testConnection();
