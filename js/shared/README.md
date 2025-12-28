# 📚 Guía de Módulos Compartidos

Esta carpeta contiene módulos JavaScript reutilizables que centralizan funcionalidades comunes del sistema.

## 🎯 Objetivo

Eliminar código duplicado y proporcionar una API consistente para:

- Autenticación
- Llamadas a la API
- Funciones de utilidad

## 📂 Módulos Disponibles

### 🔐 auth.js - Módulo de Autenticación

Funciones para manejo de sesión y autenticación de usuarios.

**Funciones principales:**

```javascript
import {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  requireAuth,
  formatCedula,
  isValidCedula,
} from "./js/shared/auth.js";
```

**Ejemplos de uso:**

```javascript
// Login de usuario
const user = await login("40200476667", "password123");
if (user) {
  console.log("Login exitoso:", user.name);
}

// Verificar autenticación
if (isAuthenticated()) {
  console.log("Usuario autenticado");
}

// Proteger página (solo admin)
requireAuth("admin"); // Redirige si no es admin

// Formatear cédula
const formatted = formatCedula("40200476667");
// Resultado: '402-0047666-7'

// Validar cédula
if (isValidCedula("40200476667")) {
  console.log("Cédula válida");
}
```

### 🌐 api.js - Módulo de API

Funciones centralizadas para llamadas a la API REST.

**Funciones principales:**

```javascript
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  getAllEmployees,
  getEmployeeDetails,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getChartData,
} from "./js/shared/api.js";
```

**Ejemplos de uso:**

```javascript
// Obtener todos los empleados
const employees = await getAllEmployees();

// Crear empleado
const newEmployee = await createEmployee({
  id: "402-0047666-7",
  name: "Juan Pérez",
  position: "Desarrollador",
  salary: 35000,
  password: "password123",
});

// Actualizar empleado
await updateEmployee("402-0047666-7", {
  salary: 40000,
  position: "Senior Developer",
});

// Obtener datos de gráficos
const chartData = await getChartData("402-0047666-7");

// Llamadas genéricas
const data = await apiGet("/custom-endpoint");
await apiPost("/custom-endpoint", { key: "value" });
```

### 🔧 utils.js - Módulo de Utilidades

Funciones auxiliares para formateo, validación y ayuda general.

**Funciones principales:**

```javascript
import {
  formatCurrency,
  formatDate,
  calculateDaysWorked,
  generateAvatar,
  isValidEmail,
  showToast,
  debounce,
  sortBy,
  groupBy,
} from "./js/shared/utils.js";
```

**Ejemplos de uso:**

```javascript
// Formatear moneda
const formatted = formatCurrency(25000);
// Resultado: 'RD$ 25,000.00'

// Formatear fecha
const date = formatDate("2025-12-28");
// Resultado: '28 de diciembre de 2025'

// Calcular días trabajados
const days = calculateDaysWorked("2025-01-01");
// Resultado: 362 (aprox)

// Generar avatar
const avatarUrl = generateAvatar("Juan Pérez");
// Resultado: URL de avatar con iniciales 'JP'

// Mostrar notificación
showToast("Operación exitosa", "success");
showToast("Error al guardar", "error");

// Validar email
if (isValidEmail("user@example.com")) {
  console.log("Email válido");
}

// Ordenar array
const sorted = sortBy(employees, "name", true);

// Agrupar por propiedad
const grouped = groupBy(employees, "position");
```

## 🎨 Integración en HTML

Para usar los módulos en tus páginas HTML, usa `type="module"`:

```html
<script type="module">
  import { login, formatCedula } from "./js/shared/auth.js";
  import { getAllEmployees } from "./js/shared/api.js";
  import { formatCurrency, showToast } from "./js/shared/utils.js";

  // Tu código aquí
  async function loadData() {
    const employees = await getAllEmployees();
    employees.forEach((emp) => {
      console.log(emp.name, formatCurrency(emp.salary));
    });
  }
</script>
```

## ✅ Ventajas de Usar Módulos Compartidos

1. **DRY (Don't Repeat Yourself)**: Código escrito una sola vez
2. **Mantenibilidad**: Cambios en un solo lugar
3. **Consistencia**: Misma lógica en todo el sistema
4. **Testing**: Más fácil probar funciones aisladas
5. **Documentación**: Código mejor organizado

## 🔄 Migración de Código Antiguo

### Antes (código duplicado):

```javascript
// En cada archivo HTML
const response = await fetch("http://localhost:3000/api/employees");
const employees = await response.json();

// Formateo manual
const formatted = `RD$ ${amount.toFixed(2)}`;
```

### Después (usando módulos):

```javascript
import { getAllEmployees } from "./js/shared/api.js";
import { formatCurrency } from "./js/shared/utils.js";

const employees = await getAllEmployees();
const formatted = formatCurrency(amount);
```

## 📊 Cobertura de Funcionalidades

| Funcionalidad | Antes                          | Después                 |
| ------------- | ------------------------------ | ----------------------- |
| Autenticación | Código duplicado en 4 archivos | 1 módulo centralizado   |
| Llamadas API  | Fetch manual en cada archivo   | Funciones wrapper       |
| Formateo      | Lógica dispersa                | Utilidades compartidas  |
| Validación    | Regex en múltiples lugares     | Funciones de validación |

## 🚀 Mejores Prácticas

1. **Siempre importar lo necesario**: No importes todo el módulo

   ```javascript
   // ✅ Bueno
   import { login, logout } from "./js/shared/auth.js";

   // ❌ Evitar (no disponible en ES6 modules)
   import * as auth from "./js/shared/auth.js";
   ```

2. **Manejo de errores**: Los módulos lanzan errores, captúralos

   ```javascript
   try {
     const employees = await getAllEmployees();
   } catch (error) {
     showToast("Error al cargar empleados", "error");
   }
   ```

3. **Usar funciones de utilidad**: No reinventes la rueda

   ```javascript
   // ✅ Bueno
   const formatted = formatCurrency(amount);

   // ❌ Evitar
   const formatted = `RD$ ${amount.toFixed(2)}`;
   ```

## 🔗 Ver También

- [../../docs/API.md](../../docs/API.md) - Documentación de API
- [../../docs/README.md](../../docs/README.md) - Documentación general
- [../employees-api.js](../employees-api.js) - API específica de empleados (legacy)

## 📝 Notas de Versión

- **v1.0** (Diciembre 2025): Creación inicial de módulos compartidos
  - auth.js con funciones de autenticación
  - api.js con wrappers de fetch
  - utils.js con utilidades generales
