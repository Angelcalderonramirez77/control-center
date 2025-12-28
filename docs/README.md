# 🏢 Control Center Pro v2.0 - Sistema de Gestión de Nómina

## ✨ NUEVAS CARACTERÍSTICAS (Versión 2.0)

### 🎉 14 Características Profesionales Implementadas

1. ✅ **Reportes de Nómina** - PDF y Excel
2. ✅ **Historial de Pagos** - Completo y filtrable
3. ✅ **Cálculos de Retenciones** - ISR, AFP, SFS automáticos
4. ✅ **Auditoría Completa** - Registro de quién cambió qué
5. ✅ **Gestión de Departamentos** - Crear y organizar
6. ✅ **Filtros Avanzados** - Por rol, salario, fecha
7. ✅ **Edición en Lote** - Actualizar múltiples a la vez
8. ✅ **Bonificaciones/Deducciones** - Vales, bonos, descuentos
9. ✅ **Proyección de Nómina** - Simular costos futuros
10. ✅ **Análisis de Datos** - Gráficos y estadísticas
11. ✅ **Generación de PDFs** - Profesionales con datos reales
12. ✅ **Exportación a Excel** - Con formatos y estilos
13. ✅ **Sistema de Logging** - Rastreo de eventos
14. ✅ **Centro de Reportes** - Interface unificada

---

## 🚀 ACCESO RÁPIDO

### Opción 1: Más Fácil (Recomendado)

1. Busca **"Iniciar Servidor Control Center"** en tu escritorio
2. Haz doble clic
3. ¡Listo!

### Opción 2: Desde la carpeta

1. Abre: `c:\Users\angel\Desktop\Diseño y Construcción de Interfaces\proyecto final`
2. Haz doble clic en **`iniciar-servidor.bat`**
3. Espera el mensaje "Servidor escuchando en puerto 3000"

---

## 🌐 ACCEDER A LA APLICACIÓN

**URL:** http://localhost:3000

### 👤 Credenciales

```
Cédula:     402-0047666-7
Contraseña: 40200476667 (sin guiones)
Nombre:     Angel Calderonramirez
Rol:        Administrador
```

---

## 📊 PANEL ADMINISTRATIVO

### Secciones Principales

**1. Dashboard**

- Estadísticas en tiempo real
- Gráficos de salarios (Barras, Línea, Área, Circular)
- Ganancias mensuales

**2. Gestión de Empleados**

- Ver todos los empleados
- Buscar por nombre o cédula
- Editar información
- Agregar nuevos empleados
- Desactivar empleados

**3. Centro de Reportes** ⭐ NUEVO

- Acceso mediante botón "📊 Reportes" en el header

---

## 📄 CENTRO DE REPORTES (Nuevo)

**URL:** http://localhost:3000/reports.html

### 5 Tabs Principales

#### 📋 Tab 1: Nómina

- Generar PDF de nómina mensual
- Exportar a Excel
- Filtrar por mes y empleado
- Resumen de totales

#### 💰 Tab 2: Pagos

- Ver historial de pagos
- Filtrar por fecha y empleado
- Detalles de cada transacción
- Totales por concepto

#### 🔍 Tab 3: Auditoría

- Registro de todos los cambios
- Quién cambió qué y cuándo
- Comparación antes/después
- Filtros por acción y fecha

#### 📈 Tab 4: Análisis

- Análisis de crecimiento salarial
- **Proyección de nómina** - Simular mes futuro
- Comparativas de costos
- KPIs importantes

#### 💸 Tab 5: Retenciones

- Calculadora de ISR, AFP, SFS
- Escala progresiva según RD
- Detalles de retenciones
- Comparación salario bruto vs neto

---

## 💾 BASE DE DATOS

### Nuevas Tablas Creadas

- `departments` - Departamentos
- `audit_log` - Registro de cambios
- `payment_history` - Historial de pagos
- `withholdings` - ISR, AFP, SFS
- `bonuses_deductions` - Bonos y descuentos
- `attendance` - Asistencia (estructura lista)
- `monthly_profits` - Ganancias mensuales
- `user_permissions` - Permisos de usuarios

### Datos Iniciales

- 5 Departamentos preconfigurados
- 4 Roles (admin, rh_manager, accountant, employee)
- 1 Administrador principal

---

## 🛠️ TECNOLOGÍAS

### Backend Mejorado

```
✅ pdfkit         - Generación de PDFs profesionales
✅ exceljs        - Exportación a Excel con estilos
✅ decimal.js     - Cálculos financieros precisos
✅ winston        - Sistema de logging avanzado
✅ jsonwebtoken   - Autenticación mejorada
✅ multer         - Manejo de archivos (estructura lista)
```

### Frontend

- HTML5 + CSS3 (Dark Theme Profesional)
- JavaScript ES6+ moderno
- Chart.js 3.9.1 para gráficos
- Interfaz responsive

---

## 📋 FUNCIONES PRINCIPALES

### Gestión de Departamentos

```bash
GET /api/admin/departments         # Listar todos
POST /api/admin/departments        # Crear nuevo
PUT /api/admin/departments/:id     # Editar
DELETE /api/admin/departments/:id  # Eliminar
```

### Filtros Avanzados de Empleados

```bash
GET /api/admin/employees/advanced-filter
# ?roleId=1&departmentId=1&salaryMin=30000&salaryMax=100000
# ?startDateFrom=2024-01-01&isActive=true
```

### Edición en Lote

```bash
POST /api/admin/employees/bulk-update
# Actualizar múltiples empleados a la vez
```

### Reportes y PDFs

```bash
GET /api/reports/payroll-pdf?month=2025-01
GET /api/reports/payroll-excel?month=2025-01
GET /api/reports/audit-log
```

### Nómina y Pagos

```bash
POST /api/payments/register              # Registrar pago
GET /api/payments/history                # Historial
POST /api/payroll/calculate              # Calcular retenciones
POST /api/payroll/project                # Proyectar futuro
```

---

## 📊 CÁLCULOS DE RETENCIONES (República Dominicana)

### AFP (Fondo de Pensión)

- **Tasa:** 2.5%
- **Fórmula:** Salario × 0.025

### SFS (Seguro Familiar Salud)

- **Tasa:** 2.87%
- **Fórmula:** Salario × 0.0287

### ISR (Impuesto sobre la Renta) - Escala 2025

```
Hasta RD$ 100,000           → 10%
RD$ 100,001 - 150,000       → 15%
RD$ 150,001 - 200,000       → 20%
RD$ 200,001 - 295,000       → 25%
Más de RD$ 295,000          → 25%
```

---

## 🔒 SEGURIDAD Y AUDITORÍA

### Protecciones

✅ Contraseñas hasheadas con bcrypt
✅ Validación de todas las entradas
✅ CORS habilitado correctamente
✅ Registro de auditoría completo

### Logs

```
logs/combined.log  - Todos los eventos
logs/error.log     - Solo errores
logs/payments.log  - Eventos de pagos
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### "Puerto 3000 ya está en uso"

```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
```

### "No puedo conectar a la base de datos"

1. Verificar que PostgreSQL esté ejecutándose
2. Verificar que la BD `nomina_db` existe
3. Verificar credenciales en `backend/db.js`

### "Los PDFs no se descargan"

1. Verificar que pdfkit está instalado: `npm list pdfkit`
2. Verificar permisos de carpeta
3. Revisar console del navegador (F12)

---

## 📁 ESTRUCTURA NUEVA

```
proyecto final/
├── reports.html              ⭐ NUEVO - Centro de Reportes
├── css/
│   └── reports.css          ⭐ NUEVO - Estilos reportes
├── js/
│   └── reports.js           ⭐ NUEVO - Lógica reportes
├── backend/
│   ├── routes/
│   │   ├── reports.js       ⭐ NUEVO - APIs reportes
│   │   ├── admin.js         ⭐ NUEVO - APIs admin
│   │   └── payroll.js       ⭐ NUEVO - APIs nómina
│   ├── migrations_completas.sql ⭐ NUEVO
│   ├── alter_tables.sql     ⭐ NUEVO
│   └── logs/                ⭐ NUEVO - Sistema de logging
├── API_DOCUMENTATION.md     ⭐ NUEVO - Documentación completa
└── README.md               (este archivo)
```

---

## 🎯 CÓMO USAR CADA FEATURE

### 1. Generar Reporte de Nómina

1. Click en "📊 Reportes" en el header
2. Tab "📋 Nómina"
3. Seleccionar mes
4. Click "📄 Generar PDF" o "📊 Exportar Excel"

### 2. Ver Historial de Pagos

1. Tab "💰 Pagos"
2. Filtrar por fechas y empleado
3. Click "🔍 Buscar"
4. Ver resumen de totales

### 3. Ver Auditoría

1. Tab "🔍 Auditoría"
2. Filtrar por tipo de acción (CREATE, UPDATE, DELETE)
3. Ver quién, qué, cuándo

### 4. Proyectar Nómina Futura

1. Tab "📈 Análisis"
2. "Proyección de Nómina"
3. Seleccionar mes a proyectar
4. Click "🔮 Proyectar"

### 5. Calcular Retenciones

1. Tab "💸 Retenciones"
2. Ingresar monto de salario
3. Click "💰 Calcular"
4. Ver desglose de ISR, AFP, SFS

---

## 📞 VERSIÓN Y SOPORTE

**Versión:** 2.0.0
**Fecha:** 25 de Diciembre, 2025
**Estado:** ✅ Completamente funcional

Para más detalles: Ver `API_DOCUMENTATION.md`

---

**Hecho con ❤️ usando Node.js, Express, PostgreSQL y JavaScript**
**Control Center Pro © 2025**

## ❌ Si el servidor no inicia

**Problema:** "npm no encontrado"

- **Solución:** Instala Node.js desde https://nodejs.org/

**Problema:** "Puerto 3000 en uso"

- **Solución:** Cierra otros programas que usen ese puerto o reinicia tu PC

**Problema:** Error de conexión a Base de Datos

- **Solución:** Asegúrate de que PostgreSQL esté corriendo

---

## 📋 Requisitos

- Node.js v18+ (incluye npm)
- PostgreSQL 18+
- Navegador web moderno (Chrome, Firefox, Edge)

---

## 🛑 Para detener el servidor

En la ventana del terminal:

- **Presiona:** `Ctrl + C`
- Escribe: `S` (para confirmar)
- Presiona Enter

---

**¿Necesitas ayuda?** Contacta al soporte técnico.
