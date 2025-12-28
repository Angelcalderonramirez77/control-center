-- Migración: Cambiar de ID numérico a Cédula Dominicana
-- Contraseña: Yescanny402 (hash: $2b$10$z3ub4/6P8JWn68A2KvfxpeHAVxhfEt/Zj4G3TZDloz4KhbIEXqh46)
-- Paso 1: Eliminar restricciones foráneas
ALTER TABLE IF EXISTS daily_income DROP CONSTRAINT IF EXISTS fk_employee_income;
ALTER TABLE IF EXISTS monthly_profits DROP CONSTRAINT IF EXISTS fk_employee_profit;
ALTER TABLE IF EXISTS monthly_profits DROP CONSTRAINT IF EXISTS monthly_profits_employee_id_fkey;
-- Paso 2: Cambiar tipos de datos
ALTER TABLE daily_income
ALTER COLUMN employee_id TYPE VARCHAR(13);
ALTER TABLE IF EXISTS monthly_profits
ALTER COLUMN employee_id TYPE VARCHAR(13);
-- Paso 3: Crear tabla backup
CREATE TABLE IF NOT EXISTS employees_backup AS
SELECT *
FROM employees;
-- Paso 4: Crear tabla nueva con estructura correcta
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
-- Paso 5: Copiar datos del backup con nuevas cédulas
-- Usando la contraseña hasheada: $2b$10$z3ub4/6P8JWn68A2KvfxpeHAVxhfEt/Zj4G3TZDloz4KhbIEXqh46
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
SELECT CASE
        WHEN id = '2002' THEN '402-0047666-7'
        WHEN id = '1001' THEN '401-1234567-8'
        WHEN id = '1003' THEN '403-9876543-2'
        WHEN id = '1004' THEN '404-5555555-5'
        ELSE id
    END as cedula,
    name,
    email,
    '$2b$10$z3ub4/6P8JWn68A2KvfxpeHAVxhfEt/Zj4G3TZDloz4KhbIEXqh46'::VARCHAR(255),
    role_id,
    salary,
    daily_wage,
    position,
    start_date,
    hours_per_day
FROM employees_backup;
-- Paso 6: Actualizar daily_income con nuevas cédulas
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
-- Paso 7: Actualizar monthly_profits con nuevas cédulas
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
-- Paso 8: Eliminar tabla antigua y renombrar
DROP TABLE employees;
ALTER TABLE employees_new
    RENAME TO employees;
-- Paso 9: Restaurar restricciones foráneas
ALTER TABLE daily_income
ADD CONSTRAINT fk_employee_income FOREIGN KEY (employee_id) REFERENCES employees(cedula) ON DELETE CASCADE;
ALTER TABLE monthly_profits
ADD CONSTRAINT fk_employee_profit FOREIGN KEY (employee_id) REFERENCES employees(cedula) ON DELETE CASCADE;
-- Confirmación
SELECT 'Migración completada. Sistema usa Cédula Dominicana (XXX-XXXXXXX-X)' as resultado;