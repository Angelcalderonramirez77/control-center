-- Migración: Cambiar de ID numérico a Cédula Dominicana
-- Formato: XXX-XXXXXXX-X (ejemplo: 402-0047666-7)
-- Este script assume que el servidor tiene las passwords ya hasheadas
-- Primero, crear la tabla con la nueva estructura
BEGIN;
-- Paso 1: Crear tabla temporal con la nueva estructura
CREATE TABLE employees_backup AS
SELECT *
FROM employees;
-- Paso 2: Eliminar restricciones de clave foránea
ALTER TABLE daily_income DROP CONSTRAINT IF EXISTS daily_income_employee_id_fkey;
ALTER TABLE monthly_profits DROP CONSTRAINT IF EXISTS monthly_profits_employee_id_fkey;
-- Paso 3: Cambiar tipo de dato en daily_income
ALTER TABLE daily_income
ALTER COLUMN employee_id TYPE VARCHAR(13);
-- Paso 4: Actualizar registros en daily_income
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
-- Paso 5: Cambiar tipo de dato en monthly_profits si existe
ALTER TABLE IF EXISTS monthly_profits
ALTER COLUMN employee_id TYPE VARCHAR(13);
UPDATE monthly_profits
SET employee_id = '402-0047666-7'
WHERE employee_id = '2002';
UPDATE monthly_profits
SET employee_id = '401-1234567-8'
WHERE employee_id = '1001';
UPDATE monthly_profits
SET employee_id = '403-9876543-2'
WHERE employee_id = '1003';
UPDATE monthly_profits
SET employee_id = '404-5555555-5'
WHERE employee_id = '1004';
-- Paso 6: Recrear tabla employees con nueva estructura
DROP TABLE employees;
CREATE TABLE employees (
    cedula VARCHAR(13) PRIMARY KEY CHECK (cedula ~ '^\d{3}-\d{7}-\d$'),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL REFERENCES roles(id),
    salary NUMERIC(10, 2) NOT NULL,
    daily_wage NUMERIC(10, 2),
    position VARCHAR(100),
    start_date DATE DEFAULT CURRENT_DATE,
    hours_per_day INT DEFAULT 8
);
-- Paso 7: Copiar datos con nuevas cédulas
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
VALUES (
        '402-0047666-7',
        'Angel Calderon',
        'angel@controlcenter.com',
        '$2b$10$bVKdcRLBjqAC4GiNwvXJsO/pjKIE7Z6X7Z6X7Z6X7Z6X7Z6X7Z6X.',
        (
            SELECT id
            FROM roles
            WHERE name = 'admin'
        ),
        40000.00,
        1818.18,
        'Administrador',
        CURRENT_DATE,
        8
    ),
    (
        '401-1234567-8',
        'Juan Pérez',
        'juan@controlcenter.com',
        '$2b$10$bVKdcRLBjqAC4GiNwvXJsO/pjKIE7Z6X7Z6X7Z6X7Z6X7Z6X7Z6X.',
        (
            SELECT id
            FROM roles
            WHERE name = 'employee'
        ),
        30000.00,
        1363.64,
        'Empleado',
        CURRENT_DATE,
        8
    ),
    (
        '403-9876543-2',
        'Ana García',
        'ana@controlcenter.com',
        '$2b$10$bVKdcRLBjqAC4GiNwvXJsO/pjKIE7Z6X7Z6X7Z6X7Z6X7Z6X7Z6X.',
        (
            SELECT id
            FROM roles
            WHERE name = 'employee'
        ),
        28000.00,
        1272.73,
        'Empleada',
        CURRENT_DATE,
        8
    ),
    (
        '404-5555555-5',
        'Carlos Sánchez',
        'carlos@controlcenter.com',
        '$2b$10$bVKdcRLBjqAC4GiNwvXJsO/pjKIE7Z6X7Z6X7Z6X7Z6X7Z6X7Z6X.',
        (
            SELECT id
            FROM roles
            WHERE name = 'employee'
        ),
        32000.00,
        1454.55,
        'Empleado',
        CURRENT_DATE,
        8
    );
-- Paso 8: Re-añadir restricciones de clave foránea
ALTER TABLE daily_income
ADD CONSTRAINT daily_income_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES employees(cedula) ON DELETE CASCADE;
ALTER TABLE monthly_profits
ADD CONSTRAINT monthly_profits_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES employees(cedula) ON DELETE CASCADE;
COMMIT;
SELECT 'Migración completada exitosamente. Sistema ahora usa Cédula Dominicana.' as mensaje;