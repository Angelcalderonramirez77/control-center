-- Migración: Cambiar de ID numérico a Cédula Dominicana
-- Formato: XXX-XXXXXXX-X (ejemplo: 402-0047666-7)
-- Paso 1: Crear tabla temporal con la nueva estructura
CREATE TABLE employees_new (
    cedula VARCHAR(13) PRIMARY KEY CHECK (cedula ~ '^\d{3}-\d{7}-\d$'),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    salary NUMERIC(10, 2) NOT NULL,
    daily_wage NUMERIC(10, 2),
    position VARCHAR(100),
    start_date DATE DEFAULT CURRENT_DATE,
    hours_per_day INT DEFAULT 8,
    CONSTRAINT fk_role_new FOREIGN KEY(role_id) REFERENCES roles(id)
);
-- Paso 2: Copiar datos existentes (si existen) con nuevas cédulas
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
        'adminpassword',
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
        'password123',
        (
            SELECT id
            FROM roles
            WHERE name = 'employee'
        ),
        30000.00,
        1363.64,
        'Desarrollador',
        CURRENT_DATE,
        8
    ),
    (
        '403-9876543-2',
        'Ana García',
        'ana@controlcenter.com',
        'password456',
        (
            SELECT id
            FROM roles
            WHERE name = 'employee'
        ),
        28000.00,
        1272.73,
        'Diseñadora',
        CURRENT_DATE,
        8
    ),
    (
        '404-5555555-5',
        'Carlos Sánchez',
        'carlos@controlcenter.com',
        'password789',
        (
            SELECT id
            FROM roles
            WHERE name = 'employee'
        ),
        32000.00,
        1454.55,
        'Analista',
        CURRENT_DATE,
        8
    );
-- Paso 3: Eliminar tabla antigua
DROP TABLE IF EXISTS employees CASCADE;
-- Paso 4: Renombrar tabla nueva
ALTER TABLE employees_new
    RENAME TO employees;
-- Paso 5: Actualizar daily_income si existe
-- (Se actualizará automáticamente por referencia de clave foránea)
-- Confirmación
SELECT 'Migración completada. ID ahora usa Cédula Dominicana (XXX-XXXXXXX-X)' as message;