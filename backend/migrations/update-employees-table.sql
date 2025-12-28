-- Script para actualizar la base de datos con nuevos campos
-- Ejecuta esto en pgAdmin o en la consola de PostgreSQL
-- Agregar columnas a la tabla employees
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS position VARCHAR(100);
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS daily_wage NUMERIC(10, 2);
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS hours_per_day INT DEFAULT 8;
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS photo_url VARCHAR(255);
-- Crear tabla de ingresos diarios
CREATE TABLE IF NOT EXISTS daily_income (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(10) NOT NULL,
    income_date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    hours_worked INT DEFAULT 8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee_income FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE(employee_id, income_date)
);
-- Actualizar datos de ejemplo con los nuevos campos
UPDATE employees
SET start_date = '2023-01-15',
    position = 'Desarrollador Junior',
    daily_wage = 187.50,
    hours_per_day = 8,
    photo_url = 'https://i.pravatar.cc/150?u=1001'
WHERE id = '1001';
UPDATE employees
SET start_date = '2022-06-01',
    position = 'Gerente General',
    daily_wage = 500.00,
    hours_per_day = 8,
    photo_url = 'https://i.pravatar.cc/150?u=2002'
WHERE id = '2002';
UPDATE employees
SET start_date = '2023-03-20',
    position = 'Analista de Sistemas',
    daily_wage = 312.50,
    hours_per_day = 8,
    photo_url = 'https://i.pravatar.cc/150?u=1003'
WHERE id = '1003';
UPDATE employees
SET start_date = '2023-09-10',
    position = 'Especialista en Ventas',
    daily_wage = 225.00,
    hours_per_day = 8,
    photo_url = 'https://i.pravatar.cc/150?u=1004'
WHERE id = '1004';
-- Insertar datos de ingresos diarios de ejemplo
INSERT INTO daily_income (employee_id, income_date, amount, hours_worked)
VALUES -- Empleado 1001
    ('1001', '2025-12-01', 1500.00, 8),
    ('1001', '2025-12-02', 1500.00, 8),
    ('1001', '2025-12-03', 937.50, 5),
    ('1001', '2025-12-04', 1500.00, 8),
    ('1001', '2025-12-05', 1500.00, 8),
    -- Empleado 2002
    ('2002', '2025-12-01', 4000.00, 8),
    ('2002', '2025-12-02', 4000.00, 8),
    ('2002', '2025-12-03', 2500.00, 5),
    ('2002', '2025-12-04', 4000.00, 8),
    ('2002', '2025-12-05', 4000.00, 8),
    -- Empleado 1003
    ('1003', '2025-12-01', 2500.00, 8),
    ('1003', '2025-12-02', 2500.00, 8),
    ('1003', '2025-12-03', 1562.50, 5),
    ('1003', '2025-12-04', 2500.00, 8),
    ('1003', '2025-12-05', 2500.00, 8),
    -- Empleado 1004
    ('1004', '2025-12-01', 1800.00, 8),
    ('1004', '2025-12-02', 1800.00, 8),
    ('1004', '2025-12-03', 1125.00, 5),
    ('1004', '2025-12-04', 1800.00, 8),
    ('1004', '2025-12-05', 1800.00, 8);