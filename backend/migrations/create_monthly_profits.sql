-- Script para crear la tabla de ganancias mensuales
CREATE TABLE IF NOT EXISTS monthly_profits (
    id SERIAL PRIMARY KEY,
    month VARCHAR(50) NOT NULL,
    profit NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Insertar datos de ejemplo
INSERT INTO monthly_profits (month, profit)
VALUES ('Enero', 50000),
    ('Febrero', 55000),
    ('Marzo', 48000),
    ('Abril', 62000),
    ('Mayo', 59000),
    ('Junio', 65000),
    ('Julio', 72000),
    ('Agosto', 68000),
    ('Septiembre', 74000),
    ('Octubre', 71000),
    ('Noviembre', 78000),
    ('Diciembre', 85000);