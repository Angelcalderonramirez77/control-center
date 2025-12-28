#!/usr/bin/env node
/**
 * Script para insertar datos de prueba
 * Ejecutar: node insert_test_data.js
 */

const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'nomina_db',
    user: 'postgres',
    password: 'Yescanny402'
});

async function insertTestData() {
    try {
        await client.connect();
        console.log('\n✅ Conectado a la base de datos\n');

        // PRIMERO: Obtener empleados existentes
        console.log('📌 Obteniendo empleados existentes...');
        const employeesResult = await client.query(
            'SELECT cedula FROM employees LIMIT 10'
        );

        if (employeesResult.rows.length === 0) {
            console.error('❌ No hay empleados en la base de datos');
            console.error('Por favor, crea empleados primero desde el panel administrativo');
            process.exit(1);
        }

        const employees = employeesResult.rows.map(e => e.cedula);
        console.log(`✅ Se encontraron ${employees.length} empleados: ${employees.join(', ')}\n`);

        // 1. Insertar datos de pagos (usar empleados reales)
        console.log('📌 Insertando datos de pagos...');
        const paymentsData = [
            [employees[0], '2025-01-15', 55000, 5000, 0, 50000],
            [employees.length > 1 ? employees[1] : employees[0], '2025-01-15', 45000, 2000, 500, 46500],
            [employees.length > 2 ? employees[2] : employees[0], '2025-01-15', 50000, 3000, 0, 53000],
            [employees.length > 3 ? employees[3] : employees[0], '2025-01-15', 35000, 1000, 250, 35750],
            [employees.length > 4 ? employees[4] : employees[0], '2025-01-15', 60000, 0, 1000, 59000],
            [employees.length > 5 ? employees[5] : employees[0], '2025-01-15', 40000, 4000, 500, 43500],
            [employees[0], '2025-12-15', 55000, 10000, 500, 64500],
            [employees.length > 1 ? employees[1] : employees[0], '2025-12-15', 45000, 5000, 500, 49500],
            [employees.length > 2 ? employees[2] : employees[0], '2025-12-15', 50000, 6000, 0, 56000],
            [employees.length > 3 ? employees[3] : employees[0], '2025-12-15', 35000, 3000, 250, 37750],
            [employees.length > 4 ? employees[4] : employees[0], '2025-12-15', 60000, 0, 1000, 59000],
            [employees.length > 5 ? employees[5] : employees[0], '2025-12-15', 40000, 8000, 500, 47500],
        ];

        for (const [cedula, date, salary, bonus, deduct, net] of paymentsData) {
            await client.query(
                `INSERT INTO payment_history 
                (employee_cedula, payment_date, salary_amount, bonus, deductions, net_amount, payment_method, status, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, 'TRANSFERENCIA', 'PAGADO', $7)
                ON CONFLICT DO NOTHING`,
                [cedula, date, salary, bonus, deduct, net, cedula]
            );
        }
        console.log('✅ Pagos insertados\n');

        // 2. Insertar retenciones
        console.log('📌 Insertando retenciones...');
        const result = await client.query(
            'SELECT id, employee_cedula, salary_amount FROM payment_history LIMIT 20'
        );

        for (const payment of result.rows) {
            const isr = payment.salary_amount * 0.15;
            const afp = payment.salary_amount * 0.025;
            const sfs = payment.salary_amount * 0.0287;
            const total = isr + afp + sfs;

            await client.query(
                `INSERT INTO withholdings 
                (payment_id, employee_cedula, isr, afp, sfs, total_withholdings, calculation_date)
                VALUES ($1, $2, $3, $4, $5, $6, NOW())
                ON CONFLICT DO NOTHING`,
                [payment.id, payment.employee_cedula, isr, afp, sfs, total]
            );
        }
        console.log('✅ Retenciones insertadas\n');

        // 3. Insertar auditoría
        console.log('📌 Insertando registros de auditoría...');
        const auditData = [
            [employees[0], employees.length > 1 ? employees[1] : null, 'UPDATE', 'employees', '{"salary": 40000}', '{"salary": 45000}', 'salary actualizado'],
            [employees[0], employees.length > 2 ? employees[2] : null, 'UPDATE', 'employees', '{"department_id": 1}', '{"department_id": 2}', 'departamento actualizado'],
            [employees[0], null, 'CREATE', 'payment_history', '{}', '{"payment_date": "2025-12-15"}', 'nuevo pago registrado'],
            [employees[0], employees.length > 3 ? employees[3] : null, 'UPDATE', 'employees', '{"position": "Asistente"}', '{"position": "Coordinador"}', 'posición actualizada'],
        ];

        for (const [admin, emp, action, table, old, newVal, desc] of auditData) {
            await client.query(
                `INSERT INTO audit_log 
                (admin_cedula, employee_cedula, action, table_name, old_values, new_values, changes_description, changed_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                ON CONFLICT DO NOTHING`,
                [admin, emp, action, table, old, newVal, desc]
            );
        }
        console.log('✅ Auditoría insertada\n');

        // 4. Insertar bonificaciones
        console.log('📌 Insertando bonificaciones y deducciones...');
        const bonusData = [
            [employees[0], 'BONO', 'Bono de desempeño', 5000, '2025-01-01', null, 'Alto desempeño', employees[0]],
            [employees.length > 1 ? employees[1] : employees[0], 'BONO', 'Bono de navidad', 2000, '2025-12-01', null, 'Bonificación navideña', employees[0]],
            [employees.length > 2 ? employees[2] : employees[0], 'DESCUENTO', 'Anticipo de salario', 1000, '2025-12-01', null, 'Adelanto solicitado', employees[0]],
            [employees.length > 5 ? employees[5] : employees[0], 'BONO', 'Bono adicional', 3000, '2025-12-01', null, 'Desempeño diciembre', employees[0]],
        ];

        for (const [cedula, tipo, desc, amount, eff, end, reason, appr] of bonusData) {
            await client.query(
                `INSERT INTO bonuses_deductions 
                (employee_cedula, type, description, amount, effective_date, end_date, reason, approved_by, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ACTIVO')
                ON CONFLICT DO NOTHING`,
                [cedula, tipo, desc, amount, eff, end, reason, appr]
            );
        }
        console.log('✅ Bonificaciones insertadas\n');

        console.log('================================================');
        console.log('✨ ¡ÉXITO! Todos los datos se insertaron correctamente');
        console.log('================================================\n');
        console.log('📊 Ahora puedes:');
        console.log('  1. Ir a http://localhost:3000/reports.html');
        console.log('  2. Seleccionar enero (2025-01) o diciembre (2025-12)');
        console.log('  3. Generar PDF, Excel o ver vista previa');
        console.log('  4. Ver registros de auditoría');
        console.log('  5. Proyectar nómina futura\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
        console.log('✅ Conexión cerrada\n');
    }
}

insertTestData();
