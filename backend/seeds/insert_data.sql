-- Insertar datos desde el backup con cédulas
INSERT INTO employees (
        cedula,
        name,
        email,
        password,
        role_id,
        salary,
        daily_wage,
        position,
        start_date,
        hours_per_day
    )
SELECT CASE
        WHEN id = '2002' THEN '402-0047666-7'
        WHEN id = '1001' THEN '401-1234567-8'
        WHEN id = '1003' THEN '403-9876543-2'
        WHEN id = '1004' THEN '404-5555555-5'
        ELSE id
    END as cedula,
    name,
    CASE
        WHEN id = '2002' THEN 'angel@controlcenter.com'
        WHEN id = '1001' THEN 'juan@controlcenter.com'
        WHEN id = '1003' THEN 'ana@controlcenter.com'
        WHEN id = '1004' THEN 'carlos@controlcenter.com'
        ELSE 'empleado@controlcenter.com'
    END as email,
    '$2b$10$z3ub4/6P8JWn68A2KvfxpeHAVxhfEt/Zj4G3TZDloz4KhbIEXqh46'::VARCHAR(255),
    role_id,
    salary,
    daily_wage,
    position,
    start_date,
    hours_per_day
FROM employees_backup;
-- Actualizar daily_income con las nuevas cédulas
UPDATE daily_income
SET employee_id = '402-0047666-7'
WHERE employee_id = '2002';
UPDATE daily_income
SET employee_id = '401-1234567-8'
WHERE employee_id = '1001';
UPDATE daily_income
SET employee_id = '403-9876543-2'
WHERE employee_id = '1003';
UPDATE daily_income
SET employee_id = '404-5555555-5'
WHERE employee_id = '1004';
-- Confirmar datos
SELECT 'Datos insertados correctamente' as resultado;
SELECT cedula,
    name,
    role_id
FROM employees;