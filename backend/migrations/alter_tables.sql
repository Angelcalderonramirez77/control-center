-- =====================================================
-- SCRIPT DE ACTUALIZACIÓN DE TABLAS EXISTENTES
-- =====================================================
-- Agregar columnas faltantes a la tabla employees
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS department_id INTEGER REFERENCES departments(id);
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS profile_photo VARCHAR(255);
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
-- Agregar columnas faltantes a roles si existen
ALTER TABLE roles
ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE roles
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;
-- Asegurarse que departments existe con la estructura correcta
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Las otras tablas nuevas (ya se crearon)
-- audit_log, payment_history, withholdings, bonuses_deductions, attendance, etc.
COMMIT;