-- Script para inicializar la base de datos 'control_center_db' (3NF)
-- Eliminar tablas existentes si es necesario para una reinicialización limpia

DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS monthly_profits;
-- Crear la tabla de roles (roles)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);
-- Crear la tabla de empleados (employees)
CREATE TABLE employees (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Contraseña hasheada
    role_id INT NOT NULL,
    salary NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_role
        FOREIGN KEY(role_id) 
        REFERENCES roles(id)
);
-- Crear la tabla de ganancias mensuales (monthly_profits)
CREATE TABLE monthly_profits (
    id SERIAL PRIMARY KEY,
    month VARCHAR(20) NOT NULL,
    profit NUMERIC(12, 2) NOT NULL,
    year INT NOT NULL
);
-- Insertar datos en la tabla de roles
INSERT INTO roles (name) VALUES ('employee'), ('admin');
-- Insertar datos de ejemplo en la tabla de empleados con contraseñas hasheadas
INSERT INTO employees (id, name, password, role_id, salary)
VALUES
    ('1001', 'Juan Pérez', 'password123', (SELECT id FROM roles WHERE name = 'employee'), 15000.00),
    ('2002', 'Ana García', 'adminpassword', (SELECT id FROM roles WHERE name = 'admin'), 40000.00),
    ('1003', 'Carlos Sánchez', 'testuser', (SELECT id FROM roles WHERE name = 'employee'), 25000.00),
    ('1004', 'Luisa Martínez', 'password456', (SELECT id FROM roles WHERE name = 'employee'), 18000.00);
-- Insertar datos de ejemplo en la tabla de ganancias mensuales

INSERT INTO monthly_profits (month, profit, year)
VALUES
    ('Enero', 150000.00, 2025),
    ('Febrero', 180000.00, 2025),
    ('Marzo', 220000.00, 2025),
    ('Abril', 200000.00, 2025),
    ('Mayo', 250000.00, 2025),
    ('Junio', 280000.00, 2025);
-- Mensaje de confirmación