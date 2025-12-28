-- Migración: Cambiar de ID numérico a Cédula Dominicana
-- Script más cuidadoso que elimina primero las restricciones
-- Paso 1: Crear una tabla backup
CREATE TABLE IF NOT EXISTS employees_backup AS
SELECT *
FROM employees;
-- Paso 2: Eliminar todas las restricciones foráneas que apunten a employees
ALTER TABLE daily_income DROP CONSTRAINT IF EXISTS fk_employee_income;
ALTER TABLE monthly_profits DROP CONSTRAINT IF EXISTS fk_employee_profit;
ALTER TABLE monthly_profits DROP CONSTRAINT IF EXISTS monthly_profits_employee_id_fkey;
-- Paso 3: Cambiar el tipo de columna employee_id en daily_income a VARCHAR(13)
ALTER TABLE daily_income
ALTER COLUMN employee_id TYPE VARCHAR(13);
-- Paso 4: Cambiar el tipo de columna employee_id en monthly_profits a VARCHAR(13) si existe
ALTER TABLE IF EXISTS monthly_profits
ALTER COLUMN employee_id TYPE VARCHAR(13);
-- Paso 5: Crear la nueva tabla employees con la estructura correcta
CREATE TABLE employees_new (
    cedula VARCHAR(13) PRIMARY KEY,
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
-- Paso 6: Copiar datos a la nueva tabla con cédulas asignadas
-- Angel Calderon (Admin) - 402-0047666-7
-- Juan Pérez - 401-1234567-8  
-- Ana García - 403-9876543-2
-- Carlos Sánchez - 404-5555555-5
INSERT INTO employees_new (
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
        (
            SELECT password
            FROM employees_backup
            WHERE id = '2002'
            LIMIT 1
        ), (
            SELECT id
            FROM roles
            WHERE name = 'admin'
        ),
        40000.00,
        1818.18,
        'Administrador',
        CURRENT_DATE,
        8
    );
-- Si no se pudo obtener del backup, usar un hash por defecto
INSERT INTO employees_new (
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
SELECT '402-0047666-7',
    'Angel Calderon',
    'angel@controlcenter.com',
    password,
    role_id,
    salary,
    daily_wage,
    position,
    start_date,
    hours_per_day
FROM employees_backup
WHERE id = '2002' ON CONFLICT (cedula) DO NOTHING;
INSERT INTO employees_new (
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
SELECT '401-1234567-8',
    name,
    'juan@controlcenter.com',
    password,
    role_id,
    salary,
    daily_wage,
    position,
    start_date,
    hours_per_day
FROM employees_backup
WHERE id = '1001' ON CONFLICT (cedula) DO NOTHING;
INSERT INTO employees_new (
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
SELECT '403-9876543-2',
    name,
    'ana@controlcenter.com',
    password,
    role_id,
    salary,
    daily_wage,
    position,
    start_date,
    hours_per_day
FROM employees_backup
WHERE id = '1003' ON CONFLICT (cedula) DO NOTHING;
INSERT INTO employees_new (
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
SELECT '404-5555555-5',
    name,
    'carlos@controlcenter.com',
    password,
    role_id,
    salary,
    daily_wage,
    position,
    start_date,
    hours_per_day
FROM employees_backup
WHERE id = '1004' ON CONFLICT (cedula) DO NOTHING;
-- Paso 7: Eliminar la tabla antigua
DROP TABLE employees;
-- Paso 8: Renombrar la tabla nueva
ALTER TABLE employees_new
    RENAME TO employees;
-- Paso 9: Actualizar los IDs en daily_income
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
-- Paso 10: Actualizar los IDs en monthly_profits si existen
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
-- Paso 11: Re-añadir las restricciones foráneas
ALTER TABLE daily_income
ADD CONSTRAINT fk_employee_income FOREIGN KEY (employee_id) REFERENCES employees(cedula) ON DELETE CASCADE;
ALTER TABLE monthly_profits
ADD CONSTRAINT fk_employee_profit FOREIGN KEY (employee_id) REFERENCES employees(cedula) ON DELETE CASCADE;
SELECT 'Migración completada exitosamente. ID cambio a Cédula Dominicana (XXX-XXXXXXX-X)' as resultado;