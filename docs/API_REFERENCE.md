# 🔌 REFERENCIA DE APIs REST

## 📍 Base URL

```
http://localhost:3000
```

---

## 🔐 Autenticación

### POST /api/auth/login

Autentica un usuario en el sistema.

**Request:**

```javascript
{
  "employeeId": "2002",
  "password": "adminpassword"
}
```

**Response - Éxito (200):**

```javascript
{
  "id": "2002",
  "name": "Ana García",
  "role": "admin",
  "salary": 4000,
  "position": "Admin"
}
```

**Response - Error (401):**

```javascript
{
  "error": "Código de empleado o contraseña incorrectos."
}
```

**Notas:**

- Almacena datos en `sessionStorage` automáticamente
- Las contraseñas se comparan con hashes bcrypt
- Válido por sesión del navegador

---

## 👥 Empleados

### GET /api/employees

Obtiene lista de todos los empleados.

**Response (200):**

```javascript
[
  {
    id: "1001",
    name: "Juan Pérez",
    salary: 3000.0,
    role: "employee",
    start_date: "2023-06-15",
    position: "Asistente",
    daily_wage: 136.36,
    hours_per_day: 8,
    photo_url: "https://gravatar.com/avatar/...",
  },
  {
    id: "1002",
    name: "María López",
    salary: 3500.0,
    role: "employee",
    start_date: "2023-07-01",
    position: "Especialista",
    daily_wage: 159.09,
    hours_per_day: 8,
    photo_url: "https://gravatar.com/avatar/...",
  },
  // ... más empleados
];
```

**Parámetros Query (Opcional):**

- Ninguno actualmente

**Códigos de Error:**

- 500: Error del servidor

---

### POST /api/employees

Crea un nuevo empleado.

**Request:**

```javascript
{
  "id": "1005",
  "name": "Carlos Ruiz",
  "password": "password123",
  "salary": 3200,
  "position": "Asistente",
  "start_date": "2024-01-15",
  "hours_per_day": 8
}
```

**Response (201):**

```javascript
{
  "id": "1005",
  "name": "Carlos Ruiz",
  "salary": 3200,
  "daily_wage": 145.45,
  "position": "Asistente",
  "start_date": "2024-01-15",
  "hours_per_day": 8,
  "photo_url": "https://gravatar.com/avatar/...",
  "role": "employee"
}
```

**Campos Requeridos:**

- `name` (string) - Nombre del empleado
- `password` (string) - Contraseña (será hasheada)
- `salary` (number) - Salario mensual
- `id` (string) - ID único del empleado

**Campos Opcionales:**

- `position` (string) - Default: "Empleado"
- `start_date` (date) - Default: hoy
- `hours_per_day` (number) - Default: 8

**Códigos de Error:**

- 400: Faltan campos requeridos
- 500: Error del servidor

---

### GET /api/employees/:id

Obtiene datos de un empleado específico.

**Path Parameters:**

- `id` (string) - ID del empleado

**Response (200):**

```javascript
{
  "id": "1001",
  "name": "Juan Pérez",
  "salary": 3000.00,
  "role": "employee",
  "start_date": "2023-06-15",
  "position": "Asistente",
  "daily_wage": 136.36,
  "hours_per_day": 8,
  "photo_url": "https://gravatar.com/avatar/..."
}
```

**Códigos de Error:**

- 404: Empleado no encontrado
- 500: Error del servidor

---

### PUT /api/employees/:id

Actualiza datos de un empleado.

**Path Parameters:**

- `id` (string) - ID del empleado

**Request:**

```javascript
{
  "name": "Juan Pérez García",
  "salary": 3500,
  "position": "Asistente Senior",
  "hours_per_day": 8,
  "start_date": "2023-06-15"
}
```

**Response (200):**

```javascript
{
  "message": "Empleado actualizado exitosamente",
  "employee": {
    "id": "1001",
    "name": "Juan Pérez García",
    "salary": 3500.00,
    "position": "Asistente Senior",
    "daily_wage": 159.09,
    "hours_per_day": 8,
    "start_date": "2023-06-15"
  }
}
```

**Campos Actualizables:**

- `name`, `salary`, `position`, `start_date`, `hours_per_day`

**Códigos de Error:**

- 404: Empleado no encontrado
- 500: Error del servidor

---

### DELETE /api/employees/:id

Elimina un empleado del sistema.

**Path Parameters:**

- `id` (string) - ID del empleado

**Response (200):**

```javascript
{
  "message": "Empleado eliminado exitosamente"
}
```

**Nota:**

- También elimina todos sus registros de `daily_income` (CASCADE)

**Códigos de Error:**

- 404: Empleado no encontrado
- 500: Error del servidor

---

## 📊 Detalles de Empleado

### GET /api/employees/:id/details

Obtiene detalles completos de un empleado con estadísticas de ingresos.

**Path Parameters:**

- `id` (string) - ID del empleado

**Response (200):**

```javascript
{
  "id": "1001",
  "name": "Juan Pérez",
  "salary": 3000.00,
  "role": "employee",
  "start_date": "2023-06-15",
  "position": "Asistente",
  "daily_wage": 136.36,
  "hours_per_day": 8,
  "photo_url": "https://gravatar.com/avatar/...",
  "total_income_records": 20,
  "total_income": 2727.20,
  "avg_hours_worked": 8,
  "days_worked": 20
}
```

**Campos Incluidos:**

- Información personal del empleado
- Estadísticas de ingresos agregadas
- Número de registros
- Promedio de horas trabajadas

**Códigos de Error:**

- 404: Empleado no encontrado
- 500: Error del servidor

**Caso de Uso:**

- Modal de detalles en panel admin
- Cálculo de estadísticas del empleado

---

## 💰 Ingresos Diarios

### GET /api/employees/:id/income

Obtiene histórico de ingresos diarios de un empleado.

**Path Parameters:**

- `id` (string) - ID del empleado

**Query Parameters:**

- `limit` (number, optional) - Limitar resultados. Default: 30

**Response (200):**

```javascript
[
  {
    id: 15,
    employee_id: "1001",
    income_date: "2024-01-20",
    amount: 136.36,
    hours_worked: 8,
  },
  {
    id: 14,
    employee_id: "1001",
    income_date: "2024-01-19",
    amount: 136.36,
    hours_worked: 8,
  },
  // ... más registros (ordenados por fecha descendente)
];
```

**Códigos de Error:**

- 404: Empleado no encontrado
- 500: Error del servidor

**Caso de Uso:**

- Gráfico de ingresos del empleado
- Tabla de ingresos recientes
- Cálculo de ingreso total

---

## 📈 Gráficos

### GET /api/charts/salary-distribution

Obtiene datos para gráfico de distribución de salarios.

**Response (200):**

```javascript
{
  "labels": [
    "Juan Pérez",
    "María López",
    "Pedro García",
    "Ana García"
  ],
  "data": [3000, 3500, 2800, 4000]
}
```

**Formato:**

- `labels` (array) - Nombres de empleados
- `data` (array) - Salarios mensuales

**Códigos de Error:**

- 500: Error del servidor

**Caso de Uso:**

- Gráfico de barras en dashboard admin
- Análisis de distribución de salarios

---

### GET /api/charts/monthly-profits

Obtiene datos para gráfico de ganancias mensuales.

**Response (200):**

```javascript
{
  "labels": [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio"
  ],
  "data": [50000, 52000, 48500, 55000, 51000, 53500]
}
```

**Formato:**

- `labels` (array) - Nombres de meses
- `data` (array) - Ganancias en moneda

**Códigos de Error:**

- 500: Error del servidor (retorna arrays vacíos)

**Caso de Uso:**

- Gráfico de línea en dashboard admin
- Seguimiento de ganancias mensuales

---

## 🔑 Códigos de Estado HTTP

| Código | Significado        | Ejemplo                  |
| ------ | ------------------ | ------------------------ |
| 200    | OK                 | GET exitoso, PUT exitoso |
| 201    | Creado             | POST exitoso             |
| 400    | Solicitud inválida | Faltan campos requeridos |
| 401    | No autorizado      | Credenciales incorrectas |
| 404    | No encontrado      | ID de empleado no existe |
| 500    | Error del servidor | Error en BD              |

---

## 🛠️ Ejemplos de Uso

### JavaScript con Fetch

**Login:**

```javascript
const response = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    employeeId: "2002",
    password: "adminpassword",
  }),
});

const user = await response.json();
if (response.ok) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
} else {
  console.error("Error:", user.error);
}
```

**Obtener todos los empleados:**

```javascript
const response = await fetch("http://localhost:3000/api/employees");
const employees = await response.json();
console.log(employees);
```

**Crear empleado:**

```javascript
const response = await fetch("http://localhost:3000/api/employees", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id: "1005",
    name: "Carlos Ruiz",
    password: "password123",
    salary: 3200,
    position: "Asistente",
    start_date: "2024-01-15",
  }),
});

const newEmployee = await response.json();
console.log("Empleado creado:", newEmployee);
```

**Obtener ingresos del empleado:**

```javascript
const response = await fetch("http://localhost:3000/api/employees/1001/income");
const incomeHistory = await response.json();

// Para usar en Chart.js
const dates = incomeHistory.map((record) => record.income_date);
const amounts = incomeHistory.map((record) => record.amount);
```

**Eliminar empleado:**

```javascript
const response = await fetch("http://localhost:3000/api/employees/1005", {
  method: "DELETE",
});

if (response.ok) {
  const result = await response.json();
  console.log(result.message); // "Empleado eliminado exitosamente"
}
```

---

## 🔒 Consideraciones de Seguridad

### Headers Recomendados:

```javascript
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
```

### Validación en Frontend:

```javascript
// Validar antes de enviar
if (!name || !salary || !position) {
  alert("Completa todos los campos requeridos");
  return;
}
```

### Manejo de Errores:

```javascript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error("Error de fetch:", error);
  alert("Error al conectar con el servidor");
}
```

---

## 📊 Pruebas con cURL

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"2002","password":"adminpassword"}'
```

**Listar empleados:**

```bash
curl http://localhost:3000/api/employees
```

**Obtener un empleado:**

```bash
curl http://localhost:3000/api/employees/1001
```

**Crear empleado:**

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "id":"1005",
    "name":"Nuevo Empleado",
    "password":"pass123",
    "salary":3000,
    "position":"Asistente"
  }'
```

**Obtener ingresos:**

```bash
curl http://localhost:3000/api/employees/1001/income
```

**Obtener gráficos:**

```bash
curl http://localhost:3000/api/charts/salary-distribution
curl http://localhost:3000/api/charts/monthly-profits
```

---

## ⚡ Rendimiento

**Límites Recomendados:**

- GET /employees: Sin límite (4 empleados)
- GET /income: Máximo 30 registros por defecto
- POST: 1 por segundo (para evitar condiciones de carrera)
- DELETE: Confirmar antes de ejecutar

**Optimización:**

- Usa índices en BD para employee_id e income_date
- Cachea resultados en frontend cuando sea posible
- Usa LIMIT en queries grandes

---

## 📝 Versión API

**Versión Actual:** 1.0  
**Última Actualización:** Enero 2024  
**PostgreSQL:** 18.1  
**Node.js:** 24.12.0  
**Express:** Latest

---

## 🔗 Rutas Disponibles

| Método | Ruta                            | Descripción             |
| ------ | ------------------------------- | ----------------------- |
| POST   | /api/auth/login                 | Autenticar usuario      |
| GET    | /api/employees                  | Listar empleados        |
| POST   | /api/employees                  | Crear empleado          |
| GET    | /api/employees/:id              | Obtener empleado        |
| PUT    | /api/employees/:id              | Actualizar empleado     |
| DELETE | /api/employees/:id              | Eliminar empleado       |
| GET    | /api/employees/:id/details      | Detalles con ingresos   |
| GET    | /api/employees/:id/income       | Ingresos diarios        |
| GET    | /api/charts/salary-distribution | Datos gráfico salarios  |
| GET    | /api/charts/monthly-profits     | Datos gráfico ganancias |

---

**Total de Endpoints:** 10  
**Métodos Soportados:** GET, POST, PUT, DELETE  
**Formato de Datos:** JSON  
**Autenticación:** Session-based (sessionStorage)
