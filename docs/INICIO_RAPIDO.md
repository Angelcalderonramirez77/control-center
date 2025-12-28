# ⚡ INICIO RÁPIDO

## 🚀 En 3 pasos:

### 1️⃣ Abre una terminal PowerShell y ejecuta:

```powershell
cd backend
node server.js
```

Deberías ver:

```
Servidor ejecutándose en puerto 3000
Conectado a PostgreSQL
```

### 2️⃣ Abre el navegador en:

```
http://localhost:3000/login.html
```

### 3️⃣ Prueba con estas credenciales:

**Como ADMINISTRADOR:**

- Código: `2002`
- Contraseña: `adminpassword`
- Te lleva a: `admin-nuevo.html` (dashboard completo)

**Como EMPLEADO:**

- Código: `1001`
- Contraseña: `password123`
- Te lleva a: `employee-profile.html` (perfil personal)

---

## ✨ Lo que puedes hacer:

### Como Admin:

✓ Ver lista completa de empleados  
✓ Crear nuevos empleados  
✓ Editar datos de empleados  
✓ Ver detalles y gráficos de ingresos  
✓ Eliminar empleados  
✓ Ver gráficos de distribución de salarios

### Como Empleado:

✓ Ver tu perfil personal  
✓ Ver tus ingresos en gráfico  
✓ Ver historial diario de ingresos  
✓ Ver días trabajados y horas

---

## 📋 Archivos principales:

**Frontend:**

- `login.html` - Página de login
- `admin-nuevo.html` - Dashboard de admin (NUEVO)
- `employee-profile.html` - Perfil de empleado (NUEVO)
- `js/app.js` - Lógica de login (ACTUALIZADO)
- `js/admin-enhanced.js` - Lógica de admin (NUEVO)
- `js/employees-api.js` - Funciones de API (NUEVO)

**Backend:**

- `backend/server.js` - Servidor Express
- `backend/routes/employees.js` - API de empleados (ACTUALIZADO)
- `backend/routes/auth.js` - Login
- `backend/db.js` - Conexión a BD

**Base de Datos:**

- PostgreSQL 18.1
- Database: `nomina_db`
- Tablas: `employees`, `roles`, `daily_income`, `monthly_profits`

---

## 🔗 URLs útiles:

| Página   | URL                                           | Uso              |
| -------- | --------------------------------------------- | ---------------- |
| Login    | `http://localhost:3000/login.html`            | Iniciar sesión   |
| Admin    | `http://localhost:3000/admin-nuevo.html`      | Dashboard admin  |
| Empleado | `http://localhost:3000/employee-profile.html` | Perfil empleado  |
| API      | `http://localhost:3000/api/employees`         | API de empleados |

---

## 🎯 Endpoints de la API:

```
GET    /api/employees              - Lista todos los empleados
POST   /api/employees              - Crear empleado
GET    /api/employees/:id          - Obtener un empleado
PUT    /api/employees/:id          - Editar empleado
DELETE /api/employees/:id          - Eliminar empleado
GET    /api/employees/:id/details  - Detalles con ingresos totales
GET    /api/employees/:id/income   - Historial de ingresos diarios
```

---

## 💻 Datos de Prueba:

**4 Empleados disponibles:**

| ID   | Nombre       | Contraseña    | Posición     |
| ---- | ------------ | ------------- | ------------ |
| 2002 | Ana García   | adminpassword | Admin        |
| 1001 | Juan Pérez   | password123   | Asistente    |
| 1002 | María López  | password123   | Especialista |
| 1003 | Pedro García | password123   | Técnico      |

---

## ⚙️ Requisitos:

- ✓ PostgreSQL 18.1 corriendo
- ✓ Node.js v24.12.0 instalado
- ✓ Dependencias instaladas (`npm install` en backend)
- ✓ Archivo `.env` configurado en backend
- ✓ Puerto 3000 disponible

---

## 🐛 Si hay problemas:

1. **"Cannot GET /login.html"**
   → El servidor no está corriendo. Ejecuta `node server.js` en `backend/`

2. **"Conexión a BD rechazada"**
   → PostgreSQL no está corriendo o credenciales incorrectas en `.env`

3. **"Gráficos no se muestran"**
   → Abre consola (F12), verifica que no haya errores de Chart.js

4. **"Login falla"**
   → Verifica que las credenciales sean exactas (incluida mayúscula de contraseña)

---

## 📖 Documentación completa:

- `CAMBIOS_REALIZADOS.md` - Resumen de todas las funcionalidades
- `GUIA_TESTING.md` - Guía completa de pruebas

¡Listo! Ahora puedes empezar a probar. 🎉
