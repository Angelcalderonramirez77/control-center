-- ================================================
-- INSERTAR DATOS DE PRUEBA PARA REPORTES
-- ================================================
-- Asegurarse de que las tablas existen
-- Si no existen, crear las tablas básicas
-- Insertar pagos de prueba en payment_history
INSERT INTO payment_history (
        employee_cedula,
        payment_date,
        salary_amount,
        bonus,
        deductions,
        net_amount,
        payment_method,
        status,
        created_by
    )
VALUES (
        '402-0047666-7',
        '2025-01-15',
        55000.00,
        5000.00,
        0.00,
        50000.00,
        'TRANSFERENCIA',
        'PAGADO',
        '402-0047666-7'
    ),
    (
        '401-1234567-8',
        '2025-01-15',
        45000.00,
        2000.00,
        500.00,
        46500.00,
        'TRANSFERENCIA',
        'PAGADO',
        '402-0047666-7'
    ),
    (
        '403-9876543-2',
        '2025-01-15',
        50000.00,
        3000.00,
        0.00,
        53000.00,
        'TRANSFERENCIA',
        'PAGADO',
        '402-0047666-7'
    ),
    (
        '404-5555555-1',
        '2025-01-15',
        35000.00,
        1000.00,
        250.00,
        35750.00,
        'CHEQUE',
        'PAGADO',
        '402-0047666-7'
    ),
    (
        '405-3333333-9',
        '2025-01-15',
        60000.00,
        0.00,
        1000.00,
        59000.00,
        'TRANSFERENCIA',
        'PAGADO',
        '402-0047666-7'
    ),
    (
        '406-2222222-6',
        '2025-01-15',
        40000.00,
        4000.00,
        500.00,
        43500.00,
        'TRANSFERENCIA',
        'PAGADO',
        '402-0047666-7'
    ),
    (
        '402-0047666-7',
        '2025-12-15',
        55000.00,
        10000.00,
        500.00,
        64500.00,
        'TRANSFERENCIA',
        'PAGADO',
        '402-0047666-7'
    ),
    (
        '401-1234567-8',
        '2025-12-15',
        45000.00,
        5000.00,
        500.00,
        49500.00,
        'TRANSFERENCIA',
        'PAGADO',
        '402-0047666-7'
    ),
    (
        '403-9876543-2',
        '2025-12-15',
        50000.00,
        6000.00,
        0.00,
        56000.00,
        'TRANSFERENCIA',
        'PAGADO',
        '402-0047666-7'
    ),
    (
        '404-5555555-1',
        '2025-12-15',
        35000.00,
        3000.00,
        250.00,
        37750.00,
        'CHEQUE',
        'PAGADO',
        '402-0047666-7'
    ),
    (
        '405-3333333-9',
        '2025-12-15',
        60000.00,
        0.00,
        1000.00,
        59000.00,
        'TRANSFERENCIA',
        'PAGADO',
        '402-0047666-7'
    ),
    (
        '406-2222222-6',
        '2025-12-15',
        40000.00,
        8000.00,
        500.00,
        47500.00,
        'TRANSFERENCIA',
        'PAGADO',
        '402-0047666-7'
    ) ON CONFLICT DO NOTHING;
-- Insertar retenciones para los pagos de enero
INSERT INTO withholdings (
        payment_id,
        employee_cedula,
        isr,
        afp,
        sfs,
        total_withholdings,
        calculation_date
    )
SELECT ph.id,
    ph.employee_cedula,
    ph.salary_amount * 0.15 as isr,
    ph.salary_amount * 0.025 as afp,
    ph.salary_amount * 0.0287 as sfs,
    (ph.salary_amount * 0.15) + (ph.salary_amount * 0.025) + (ph.salary_amount * 0.0287) as total,
    NOW()
FROM payment_history ph
WHERE DATE_TRUNC('month', ph.payment_date) = '2025-01-01' ON CONFLICT DO NOTHING;
-- Insertar retenciones para los pagos de diciembre
INSERT INTO withholdings (
        payment_id,
        employee_cedula,
        isr,
        afp,
        sfs,
        total_withholdings,
        calculation_date
    )
SELECT ph.id,
    ph.employee_cedula,
    ph.salary_amount * 0.15 as isr,
    ph.salary_amount * 0.025 as afp,
    ph.salary_amount * 0.0287 as sfs,
    (ph.salary_amount * 0.15) + (ph.salary_amount * 0.025) + (ph.salary_amount * 0.0287) as total,
    NOW()
FROM payment_history ph
WHERE DATE_TRUNC('month', ph.payment_date) = '2025-12-01' ON CONFLICT DO NOTHING;
-- Insertar registros de auditoría
INSERT INTO audit_log (
        admin_cedula,
        employee_cedula,
        action,
        table_name,
        old_values,
        new_values,
        changes_description,
        changed_at
    )
VALUES (
        '402-0047666-7',
        '401-1234567-8',
        'UPDATE',
        'employees',
        '{"salary": 40000}',
        '{"salary": 45000}',
        'salary actualizado',
        NOW() - interval '2 days'
    ),
    (
        '402-0047666-7',
        '403-9876543-2',
        'UPDATE',
        'employees',
        '{"department_id": 1}',
        '{"department_id": 2}',
        'departamento actualizado',
        NOW() - interval '1 days'
    ),
    (
        '402-0047666-7',
        '404-5555555-1',
        'CREATE',
        'payment_history',
        '{}',
        '{"payment_date": "2025-12-15"}',
        'nuevo pago registrado',
        NOW() - interval '3 hours'
    ),
    (
        '402-0047666-7',
        '405-3333333-9',
        'UPDATE',
        'employees',
        '{"position": "Asistente"}',
        '{"position": "Coordinador"}',
        'posición actualizada',
        NOW() - interval '1 hours'
    ) ON CONFLICT DO NOTHING;
-- Insertar datos de bonificaciones/deducciones
INSERT INTO bonuses_deductions (
        employee_cedula,
        type,
        description,
        amount,
        effective_date,
        end_date,
        reason,
        approved_by,
        status
    )
VALUES (
        '402-0047666-7',
        'BONO',
        'Bono de desempeño',
        5000.00,
        '2025-01-01',
        NULL,
        'Alto desempeño',
        '402-0047666-7',
        'ACTIVO'
    ),
    (
        '401-1234567-8',
        'BONO',
        'Bono de navidad',
        2000.00,
        '2025-12-01',
        NULL,
        'Bonificación navideña',
        '402-0047666-7',
        'ACTIVO'
    ),
    (
        '403-9876543-2',
        'DESCUENTO',
        'Anticipo de salario',
        -1000.00,
        '2025-12-01',
        NULL,
        'Adelanto solicitado',
        '402-0047666-7',
        'ACTIVO'
    ),
    (
        '406-2222222-6',
        'BONO',
        'Bono adicional',
        3000.00,
        '2025-12-01',
        NULL,
        'Desempeño diciembre',
        '402-0047666-7',
        'ACTIVO'
    ) ON CONFLICT DO NOTHING;
COMMIT;
SELECT 'Datos de prueba insertados exitosamente!' as mensaje;