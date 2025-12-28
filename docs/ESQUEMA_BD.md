# 📊 ESQUEMA DE BASE DE DATOS - NOMINA_DB

## 📐 Diagrama de Tablas

```
┌─────────────────────────────────────────────────────────────┐
│                           ROLES                             │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ INT                                       │
│ name             │ VARCHAR(50)  [admin, employee]            │
└─────────────────────────────────────────────────────────────┘
              ▲
              │
              │ FK (role_id)
              │
┌─────────────────────────────────────────────────────────────┐
│                        EMPLOYEES                            │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ INT                                       │
│ name             │ VARCHAR(100)                              │
│ password         │ VARCHAR(255) [bcrypt hashed]              │
│ salary           │ NUMERIC(10,2)                             │
│ role_id (FK)     │ INT → ROLES.id                            │
│ start_date       │ DATE              [🆕 NUEVO]             │
│ position         │ VARCHAR(100)      [🆕 NUEVO]             │
│ daily_wage       │ NUMERIC(10,2)     [🆕 NUEVO]             │
│ hours_per_day    │ INT DEFAULT 8     [🆕 NUEVO]             │
│ photo_url        │ VARCHAR(255)      [🆕 NUEVO]             │
└─────────────────────────────────────────────────────────────┘
              ▲
              │
              │ FK (employee_id)
              │
┌─────────────────────────────────────────────────────────────┐
│                      DAILY_INCOME                           │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ INT                                       │
│ employee_id (FK) │ INT → EMPLOYEES.id                        │
│ income_date      │ DATE                                      │
│ amount           │ NUMERIC(10,2)                             │
│ hours_worked     │ INT                                       │
│ created_at       │ TIMESTAMP DEFAULT NOW()                   │
│ UNIQUE           │ (employee_id, income_date)                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     MONTHLY_PROFITS                         │
├─────────────────────────────────────────────────────────────┤
│ id (PK)          │ INT                                       │
│ month            │ INT (1-12)                                │
│ year             │ INT (2024...)                             │
│ profit           │ NUMERIC(12,2)                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Detalle de Tablas

### 1️⃣ Tabla: ROLES

**Descripción:** Define los roles del sistema (admin, employee)

| Campo | Tipo        | Restricciones               | Descripción                      |
| ----- | ----------- | --------------------------- | -------------------------------- |
| id    | INT         | PRIMARY KEY, AUTO_INCREMENT | Identificador único              |
| name  | VARCHAR(50) | UNIQUE                      | Nombre del rol (admin, employee) |

**Datos Actuales:**

```sql
INSERT INTO roles (id, name) VALUES
  (1, 'employee'),
  (2, 'admin');
```

---

### 2️⃣ Tabla: EMPLOYEES

**Descripción:** Información de empleados con campos de salario, posición e ingresos

| Campo         | Tipo          | Restricciones           | Descripción                  |
| ------------- | ------------- | ----------------------- | ---------------------------- |
| id            | INT           | PRIMARY KEY             | ID del empleado              |
| name          | VARCHAR(100)  | NOT NULL                | Nombre completo              |
| password      | VARCHAR(255)  | NOT NULL                | Contraseña hasheada (bcrypt) |
| salary        | NUMERIC(10,2) | NOT NULL                | Salario mensual              |
| role_id       | INT           | FOREIGN KEY → roles(id) | Rol del empleado             |
| start_date    | DATE          | DEFAULT TODAY           | Fecha de inicio en empresa   |
| position      | VARCHAR(100)  | DEFAULT 'Empleado'      | Posición/cargo               |
| daily_wage    | NUMERIC(10,2) | DEFAULT salary/22       | Salario diario calculado     |
| hours_per_day | INT           | DEFAULT 8               | Horas de trabajo por día     |
| photo_url     | VARCHAR(255)  | Generated               | URL de foto/avatar           |

**Ejemplo de datos:**

```sql
┌─────┬──────────────┬──────────────────────┬────────┬─────────┬────────────────┬────────────┬────────────┬──────────────┬──────────────────────┐
│ id  │ name         │ password             │ salary │ role_id │ start_date     │ position   │ daily_wage │ hours_per_day│ photo_url            │
├─────┼──────────────┼──────────────────────┼────────┼─────────┼────────────────┼────────────┼────────────┼──────────────┼──────────────────────┤
│1001 │Juan Pérez    │$2b$10$...hash...    │ 3000.00│    1    │2023-06-15      │ Asistente  │  136.36    │      8       │gravatar.com/...1001 │
│1002 │María López   │$2b$10$...hash...    │ 3500.00│    1    │2023-07-01      │Especialista│  159.09    │      8       │gravatar.com/...1002 │
│1003 │Pedro García  │$2b$10$...hash...    │ 2800.00│    1    │2023-05-20      │ Técnico    │  127.27    │      8       │gravatar.com/...1003 │
│2002 │Ana García    │$2b$10$...hash...    │ 4000.00│    2    │2023-01-10      │ Admin      │  181.82    │      8       │gravatar.com/...2002 │
└─────┴──────────────┴──────────────────────┴────────┴─────────┴────────────────┴────────────┴────────────┴──────────────┴──────────────────────┘
```

---

### 3️⃣ Tabla: DAILY_INCOME

**Descripción:** Registro diario de ingresos por empleado

| Campo        | Tipo                       | Restricciones               | Descripción                   |
| ------------ | -------------------------- | --------------------------- | ----------------------------- |
| id           | INT                        | PRIMARY KEY, AUTO_INCREMENT | Identificador único           |
| employee_id  | INT                        | FOREIGN KEY → employees(id) | Referencia al empleado        |
| income_date  | DATE                       | NOT NULL                    | Fecha del ingreso             |
| amount       | NUMERIC(10,2)              | NOT NULL                    | Monto del ingreso (en moneda) |
| hours_worked | INT                        | NOT NULL                    | Horas trabajadas ese día      |
| created_at   | TIMESTAMP                  | DEFAULT CURRENT_TIMESTAMP   | Fecha de registro en BD       |
| UNIQUE       | (employee_id, income_date) | Constraint                  | No hay duplicados por día     |

**Ejemplo de datos:**

```sql
┌────┬─────────────┬─────────────┬────────┬──────────────┬──────────────────────┐
│id  │employee_id  │income_date  │amount  │hours_worked  │created_at            │
├────┼─────────────┼─────────────┼────────┼──────────────┼──────────────────────┤
│ 1  │    1001     │ 2024-01-15  │136.36  │      8       │2024-01-15 09:30:00  │
│ 2  │    1001     │ 2024-01-16  │136.36  │      8       │2024-01-16 09:30:00  │
│ 3  │    1001     │ 2024-01-17  │136.36  │      8       │2024-01-17 09:30:00  │
│...│    ...      │    ...      │...     │     ...      │       ...            │
│80  │    2002     │ 2024-01-20  │181.82  │      8       │2024-01-20 09:30:00  │
└────┴─────────────┴─────────────┴────────┴──────────────┴──────────────────────┘

Total: 80 registros (20 por cada uno de 4 empleados)
```

---

### 4️⃣ Tabla: MONTHLY_PROFITS

**Descripción:** Ganancias mensuales de la empresa

| Campo  | Tipo          | Restricciones               | Descripción                 |
| ------ | ------------- | --------------------------- | --------------------------- |
| id     | INT           | PRIMARY KEY, AUTO_INCREMENT | Identificador único         |
| month  | INT           | NOT NULL (1-12)             | Mes (1=enero, 12=diciembre) |
| year   | INT           | NOT NULL                    | Año                         |
| profit | NUMERIC(12,2) | NOT NULL                    | Ganancia en moneda          |

**Ejemplo de datos:**

```sql
┌────┬───────┬──────┬──────────┐
│id  │ month │ year │ profit   │
├────┼───────┼──────┼──────────┤
│ 1  │   1   │ 2024 │ 50000.00 │
│ 2  │   2   │ 2024 │ 52000.00 │
│ 3  │   3   │ 2024 │ 48500.00 │
│ 4  │   4   │ 2024 │ 55000.00 │
│ 5  │   5   │ 2024 │ 51000.00 │
│ 6  │   6   │ 2024 │ 53500.00 │
└────┴───────┴──────┴──────────┘
```

---

## 🔧 Operaciones Comunes

### Obtener todos los empleados con su rol:

```sql
SELECT e.id, e.name, e.salary, r.name as role, e.position, e.daily_wage
FROM employees e
JOIN roles r ON e.role_id = r.id
ORDER BY e.id;
```

### Obtener detalles de un empleado con ingresos totales:

```sql
SELECT
    e.id, e.name, e.salary, r.name as role,
    e.start_date, e.position, e.daily_wage, e.hours_per_day,
    COUNT(di.id) as total_income_records,
    COALESCE(SUM(di.amount), 0) as total_income,
    AVG(di.hours_worked) as avg_hours_worked
FROM employees e
JOIN roles r ON e.role_id = r.id
LEFT JOIN daily_income di ON e.id = di.employee_id
WHERE e.id = 1001
GROUP BY e.id, e.name, e.salary, r.name, e.start_date, e.position, e.daily_wage, e.hours_per_day;
```

### Obtener ingresos diarios de un empleado:

```sql
SELECT income_date, hours_worked, amount
FROM daily_income
WHERE employee_id = 1001
ORDER BY income_date DESC
LIMIT 30;
```

### Calcular días trabajados:

```sql
SELECT
    e.name,
    e.start_date,
    COUNT(di.id) as days_worked,
    TODAY() - e.start_date as total_days_since_start
FROM employees e
LEFT JOIN daily_income di ON e.id = di.employee_id
WHERE e.id = 1001
GROUP BY e.id, e.name, e.start_date;
```

### Eliminar empleado (cascade a daily_income):

```sql
DELETE FROM employees WHERE id = 1001;
-- También elimina todos sus registros en daily_income automáticamente (ON DELETE CASCADE)
```

---

## 🔐 Credenciales en BD

**Todas las contraseñas están hasheadas con bcrypt:**

```
Contraseña original: password123
Hash bcrypt: $2b$10$...64 caracteres...
```

**Para actualizar contraseña de un empleado:**

```javascript
// En Node.js:
const bcrypt = require("bcrypt");
const hashedPassword = await bcrypt.hash("nueva_password", 10);

// Luego en SQL:
// UPDATE employees SET password = 'hash_aqui' WHERE id = 1001;
```

---

## 📊 Estadísticas de Datos

| Concepto                     | Valor               |
| ---------------------------- | ------------------- |
| Total empleados              | 4                   |
| Roles diferentes             | 2 (employee, admin) |
| Registros diarios de ingreso | 80                  |
| Meses de ganancias           | 6                   |
| Rango de salarios            | $2,800 - $4,000     |
| Rango de salarios diarios    | $127 - $181         |
| Horas de trabajo por día     | 8 (todos)           |
| Foto (gravatar)              | Auto-generadas      |

---

## 🗂️ Scripts SQL Útiles

### Ver estructura de tabla:

```sql
\d employees;           -- En psql
```

### Ver todas las restricciones:

```sql
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE table_name = 'employees';
```

### Contar registros:

```sql
SELECT 'employees' as table_name, COUNT(*) as count FROM employees
UNION ALL
SELECT 'daily_income', COUNT(*) FROM daily_income
UNION ALL
SELECT 'roles', COUNT(*) FROM roles
UNION ALL
SELECT 'monthly_profits', COUNT(*) FROM monthly_profits;
```

### Ver ingresos del último mes:

```sql
SELECT
    e.name,
    di.income_date,
    SUM(di.amount) as total_amount,
    SUM(di.hours_worked) as total_hours
FROM employees e
JOIN daily_income di ON e.id = di.employee_id
WHERE di.income_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY e.name, di.income_date
ORDER BY e.name, di.income_date DESC;
```

---

## 💾 Conexión a BD

**Credenciales en .env:**

```
DB_USER=postgres
DB_PASSWORD=Yescanny402
DB_HOST=localhost
DB_NAME=nomina_db
DB_PORT=5432
```

**Conexión desde psql:**

```bash
psql -U postgres -d nomina_db -h localhost
```

**Desde Node.js:**

```javascript
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
```

---

## ✅ Integridad de Datos

- ✓ Restricciones de clave foránea activas
- ✓ Eliminación en cascada de ingresos cuando se elimina empleado
- ✓ Constraint UNIQUE en (employee_id, income_date) para evitar duplicados
- ✓ NOT NULL en campos requeridos
- ✓ AUTO_INCREMENT en IDs
- ✓ Timestamps automáticos en created_at
- ✓ Contraseñas hasheadas (no en texto plano)

---

## 🚀 Para Agregar Más Datos

### Crear nuevo empleado:

```sql
INSERT INTO employees (id, name, password, salary, role_id, start_date, position, daily_wage, hours_per_day, photo_url)
VALUES (1004, 'Nuevo Empleado', '$2b$10$...hash...', 3200, 1, '2024-01-15', 'Asistente', 145.45, 8, 'gravatar.com/...');
```

### Agregar ingresos diarios:

```sql
INSERT INTO daily_income (employee_id, income_date, amount, hours_worked)
VALUES
  (1001, '2024-01-21', 136.36, 8),
  (1001, '2024-01-22', 136.36, 8),
  (1001, '2024-01-23', 136.36, 8);
```

### Actualizar ganancias mensuales:

```sql
INSERT INTO monthly_profits (month, year, profit)
VALUES (7, 2024, 54500);
```

---

## 📖 Índices

Para mejorar performance en consultas frecuentes, considere agregar índices:

```sql
CREATE INDEX idx_employees_role_id ON employees(role_id);
CREATE INDEX idx_daily_income_employee_id ON daily_income(employee_id);
CREATE INDEX idx_daily_income_date ON daily_income(income_date);
CREATE INDEX idx_monthly_profits_year_month ON monthly_profits(year, month);
```

---

**Última actualización:** Enero 2024  
**PostgreSQL versión:** 18.1  
**Total registros:** 110 (4 empleados + 80 ingresos + 6 ganancias + 4 roles + 16 referencias)
