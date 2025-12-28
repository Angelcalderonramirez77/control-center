-- =====================================================
-- MIGRACIONES COMPLETAS PARA CONTROL CENTER PRO
-- =====================================================
-- 1. Tabla de Departamentos
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 2. Tabla de Roles (actualizada)
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 3. Tabla de Empleados (actualizada con más campos)
CREATE TABLE IF NOT EXISTS employees (
    cedula VARCHAR(13) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    department_id INTEGER REFERENCES departments(id),
    position VARCHAR(100),
    salary DECIMAL(12, 2) NOT NULL,
    daily_wage DECIMAL(10, 2),
    hours_per_day INTEGER DEFAULT 8,
    start_date DATE,
    phone VARCHAR(20),
    address TEXT,
    profile_photo VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 4. Tabla de Historial de Cambios (Auditoría)
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    admin_cedula VARCHAR(13) REFERENCES employees(cedula),
    employee_cedula VARCHAR(13) REFERENCES employees(cedula),
    action VARCHAR(50) NOT NULL,
    -- CREATE, UPDATE, DELETE, VIEW
    table_name VARCHAR(50),
    old_values JSONB,
    new_values JSONB,
    changes_description TEXT,
    ip_address VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 5. Tabla de Historial de Pagos
CREATE TABLE IF NOT EXISTS payment_history (
    id SERIAL PRIMARY KEY,
    employee_cedula VARCHAR(13) REFERENCES employees(cedula),
    payment_date DATE NOT NULL,
    salary_amount DECIMAL(12, 2) NOT NULL,
    bonus DECIMAL(10, 2) DEFAULT 0,
    deductions DECIMAL(10, 2) DEFAULT 0,
    net_amount DECIMAL(12, 2),
    payment_method VARCHAR(50),
    -- TRANSFERENCIA, CHEQUE, EFECTIVO
    status VARCHAR(20) DEFAULT 'PAGADO',
    -- PAGADO, PENDIENTE, CANCELADO
    notes TEXT,
    created_by VARCHAR(13) REFERENCES employees(cedula),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 6. Tabla de Retenciones (ISR, AFP, SFS)
CREATE TABLE IF NOT EXISTS withholdings (
    id SERIAL PRIMARY KEY,
    employee_cedula VARCHAR(13) REFERENCES employees(cedula),
    payment_id INTEGER REFERENCES payment_history(id),
    isr DECIMAL(10, 2) DEFAULT 0,
    afp DECIMAL(10, 2) DEFAULT 0,
    sfs DECIMAL(10, 2) DEFAULT 0,
    total_withholdings DECIMAL(10, 2),
    calculation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 7. Tabla de Bonificaciones y Deducciones
CREATE TABLE IF NOT EXISTS bonuses_deductions (
    id SERIAL PRIMARY KEY,
    employee_cedula VARCHAR(13) REFERENCES employees(cedula),
    type VARCHAR(20) NOT NULL,
    -- BONUS, DEDUCTION, VALE
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    effective_date DATE NOT NULL,
    end_date DATE,
    reason TEXT,
    approved_by VARCHAR(13) REFERENCES employees(cedula),
    status VARCHAR(20) DEFAULT 'ACTIVO',
    -- ACTIVO, VENCIDO, CANCELADO
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 8. Tabla de Asistencia
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    employee_cedula VARCHAR(13) REFERENCES employees(cedula),
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    hours_worked DECIMAL(5, 2),
    status VARCHAR(20),
    -- PRESENTE, AUSENTE, PERMISO, ENFERMEDAD
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 9. Tabla de Ganancias Mensuales (para gráficos)
CREATE TABLE IF NOT EXISTS monthly_profits (
    id SERIAL PRIMARY KEY,
    month DATE NOT NULL UNIQUE,
    total_payroll DECIMAL(12, 2),
    total_withholdings DECIMAL(12, 2),
    net_cost DECIMAL(12, 2),
    employee_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 10. Tabla de Ingresos Diarios
CREATE TABLE IF NOT EXISTS daily_income (
    id SERIAL PRIMARY KEY,
    employee_cedula VARCHAR(13) REFERENCES employees(cedula),
    date DATE NOT NULL,
    amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 11. Tabla de Permisos de Usuario (para múltiples admins)
CREATE TABLE IF NOT EXISTS user_permissions (
    id SERIAL PRIMARY KEY,
    admin_cedula VARCHAR(13) REFERENCES employees(cedula),
    permission_name VARCHAR(100) NOT NULL,
    granted BOOLEAN DEFAULT true,
    granted_by VARCHAR(13) REFERENCES employees(cedula),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================
CREATE INDEX idx_employees_role ON employees(role_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_active ON employees(is_active);
CREATE INDEX idx_audit_admin ON audit_log(admin_cedula);
CREATE INDEX idx_audit_employee ON audit_log(employee_cedula);
CREATE INDEX idx_audit_date ON audit_log(changed_at);
CREATE INDEX idx_payment_employee ON payment_history(employee_cedula);
CREATE INDEX idx_payment_date ON payment_history(payment_date);
CREATE INDEX idx_attendance_employee ON attendance(employee_cedula);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_bonuses_employee ON bonuses_deductions(employee_cedula);
CREATE INDEX idx_bonuses_status ON bonuses_deductions(status);
-- =====================================================
-- INSERTAR DATOS INICIALES
-- =====================================================
-- Departamentos
INSERT INTO departments (name, description)
VALUES ('Administración', 'Departamento Administrativo'),
    ('Recursos Humanos', 'Gestión de personal'),
    ('Finanzas', 'Control financiero'),
    ('Operaciones', 'Operaciones generales'),
    ('Tecnología', 'Sistemas y TI') ON CONFLICT DO NOTHING;
-- Roles con permisos
INSERT INTO roles (name, description, permissions)
VALUES (
        'admin',
        'Administrador Total',
        '["create_employee", "edit_employee", "delete_employee", "view_reports", "generate_pdf", "manage_users", "audit_log", "manage_departments"]'::jsonb
    ),
    (
        'rh_manager',
        'Gerente de RRHH',
        '["create_employee", "edit_employee", "view_reports", "view_audit"]'::jsonb
    ),
    (
        'accountant',
        'Contador',
        '["view_employees", "view_reports", "generate_pdf", "view_payments"]'::jsonb
    ),
    (
        'employee',
        'Empleado',
        '["view_profile", "view_payments"]'::jsonb
    ) ON CONFLICT DO NOTHING;
-- Insertar admin principal (si no existe)
INSERT INTO employees (
        cedula,
        name,
        email,
        password,
        role_id,
        department_id,
        position,
        salary,
        daily_wage,
        hours_per_day,
        start_date,
        is_active
    )
VALUES (
        '402-0047666-7',
        'Angel Calderonramirez',
        'admin@controlcenter.com',
        '$2b$10$z3ub4/6P8JWn68A2KvfxpeHAVxhfEt/Zj4G3TZDloz4KhbIEXqh46',
        1,
        1,
        'Administrador',
        50000.00,
        6250.00,
        8,
        NOW(),
        true
    ) ON CONFLICT DO NOTHING;
COMMIT;