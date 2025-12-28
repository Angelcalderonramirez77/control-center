# 📚 DOCUMENTACIÓN DE APIs - CONTROL CENTER PRO

## 🎯 Resumen General

Sistema completo de gestión de nómina con APIs REST para reportes, análisis, auditoría y cálculos financieros.

---

## 📊 ENDPOINTS DE REPORTES

### 1. Generar PDF de Nómina

```
GET /api/reports/payroll-pdf?month=2025-01&employeeCedula=402-0047666-7
```

**Descripción:** Genera un PDF con detalles mensuales de salarios pagados
**Parámetros:**

- `month` (requerido): Formato YYYY-MM
- `employeeCedula` (opcional): Para filtrar por empleado

**Respuesta:** Archivo PDF descargable

---

### 2. Exportar Nómina a Excel

```
GET /api/reports/payroll-excel?month=2025-01
```

**Descripción:** Exporta nómina a formato Excel con estilos
**Respuesta:** Archivo XLSX descargable

---

### 3. Obtener Historial de Pagos

```
GET /api/reports/payment-history/:cedula?limit=12&offset=0
```

**Descripción:** Obtiene todos los pagos realizados a un empleado
**Parámetros URL:**

- `cedula`: Cédula del empleado

**Parámetros Query:**

- `limit`: Registros por página (default: 12)
- `offset`: Desplazamiento (default: 0)

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee_cedula": "402-0047666-7",
      "payment_date": "2025-01-15",
      "salary_amount": 50000.0,
      "bonus": 5000.0,
      "deductions": 2500.0,
      "net_amount": 52500.0,
      "isr": 7500.0,
      "afp": 1250.0,
      "sfs": 1437.5
    }
  ]
}
```

---

### 4. Obtener Registro de Auditoría

```
GET /api/reports/audit-log?limit=50&offset=0&actionType=UPDATE&startDate=2025-01-01&endDate=2025-01-31
```

**Descripción:** Obtiene historial de cambios (quién cambió qué y cuándo)
**Parámetros:**

- `limit`: Registros por página
- `offset`: Desplazamiento
- `actionType`: CREATE, UPDATE, DELETE
- `employeeCedula`: Filtrar por empleado
- `startDate`: Fecha inicio
- `endDate`: Fecha fin

---

## 🏢 ENDPOINTS DE ADMINISTRACIÓN

### 5. Obtener Departamentos

```
GET /api/admin/departments
```

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Administración",
      "description": "Departamento Administrativo",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### 6. Crear Departamento

```
POST /api/admin/departments
Content-Type: application/json

{
    "name": "Ventas",
    "description": "Departamento de Ventas",
    "adminCedula": "402-0047666-7"
}
```

---

### 7. Actualizar Departamento

```
PUT /api/admin/departments/:id
Content-Type: application/json

{
    "name": "Ventas Actualizado",
    "description": "Descripción actualizada",
    "adminCedula": "402-0047666-7"
}
```

---

### 8. Eliminar Departamento

```
DELETE /api/admin/departments/:id
Content-Type: application/json

{
    "adminCedula": "402-0047666-7"
}
```

---

### 9. Filtros Avanzados de Empleados

```
GET /api/admin/employees/advanced-filter?roleId=1&departmentId=1&salaryMin=30000&salaryMax=100000&startDateFrom=2024-01-01&isActive=true&limit=50
```

**Descripción:** Filtrar empleados por múltiples criterios
**Parámetros:**

- `roleId`: ID del rol
- `departmentId`: ID del departamento
- `salaryMin`: Salario mínimo
- `salaryMax`: Salario máximo
- `startDateFrom`: Fecha inicio de trabajo
- `startDateTo`: Fecha fin de trabajo
- `isActive`: true/false

---

### 10. Edición en Lote (Bulk Update)

```
POST /api/admin/employees/bulk-update
Content-Type: application/json

{
    "employeeCedulas": ["402-0047666-7", "001-0000001-0"],
    "updates": {
        "salary": 55000,
        "department_id": 2,
        "position": "Gerente"
    },
    "adminCedula": "402-0047666-7"
}
```

**Descripción:** Editar múltiples empleados a la vez

---

### 11. Desactivar Empleado

```
POST /api/admin/employees/:cedula/deactivate
Content-Type: application/json

{
    "adminCedula": "402-0047666-7",
    "reason": "Jubilación"
}
```

---

## 💰 ENDPOINTS DE PAGOS Y NÓMINA

### 12. Registrar Pago

```
POST /api/payments/register
Content-Type: application/json

{
    "employeeCedula": "402-0047666-7",
    "paymentDate": "2025-01-15",
    "salaryAmount": 50000,
    "bonus": 5000,
    "deductions": 2500,
    "paymentMethod": "TRANSFERENCIA",
    "adminCedula": "402-0047666-7"
}
```

---

### 13. Obtener Historial de Pagos

```
GET /api/payments/history?startDate=2025-01-01&endDate=2025-01-31&employeeCedula=402-0047666-7&limit=100
```

---

### 14. Calcular Retenciones (ISR, AFP, SFS)

```
POST /api/payroll/calculate
Content-Type: application/json

{
    "employeeCedula": "402-0047666-7",
    "salaryAmount": 50000,
    "paymentId": 1
}
```

**Descripción:** Calcula automáticamente ISR, AFP y SFS según normas RD
**Respuesta:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "employee_cedula": "402-0047666-7",
    "isr": 5000.0,
    "afp": 1250.0,
    "sfs": 1437.5,
    "total_withholdings": 7687.5
  },
  "summary": {
    "salary": "50000.00",
    "afp": "1250.00",
    "sfs": "1437.50",
    "isr": "5000.00",
    "totalWithholdings": "7687.50",
    "net": "42312.50"
  }
}
```

---

### 15. Obtener Retenciones de Empleado

```
GET /api/payroll/:employeeCedula?limit=12&offset=0
```

---

### 16. Agregar Bonificación o Deducción

```
POST /api/payroll
Content-Type: application/json

{
    "employeeCedula": "402-0047666-7",
    "type": "BONUS",
    "description": "Bono por desempeño",
    "amount": 5000,
    "effectiveDate": "2025-01-01",
    "endDate": null,
    "reason": "Desempeño excepcional",
    "approvedBy": "402-0047666-7"
}
```

**Tipos válidos:** BONUS, DEDUCTION, VALE

---

### 17. Obtener Bonificaciones/Deducciones

```
GET /api/payroll/:employeeCedula?status=ACTIVO
```

---

### 18. Actualizar Bonificación/Deducción

```
PUT /api/payroll/:id
Content-Type: application/json

{
    "status": "VENCIDO",
    "endDate": "2025-06-30"
}
```

---

### 19. Proyectar Nómina Futura

```
POST /api/payroll/project
Content-Type: application/json

{
    "month": "2025-02"
}
```

**Descripción:** Simula costo de nómina futura considerando bonificaciones/deducciones activas
**Respuesta:**

```json
{
  "success": true,
  "month": "2025-02",
  "summary": {
    "employeeCount": 10,
    "totalPayroll": "550000.00",
    "totalWithholdings": "77000.00",
    "netCost": "473000.00"
  },
  "details": [
    {
      "cedula": "402-0047666-7",
      "salary": "55000.00",
      "withholdings": "7687.50",
      "net": "47312.50"
    }
  ]
}
```

---

## 🔐 NOTAS DE SEGURIDAD

1. **Autenticación:** Todos los endpoints requieren que el usuario esté autenticado
2. **Validación:** Todos los datos se validan antes de ser procesados
3. **Auditoría:** Todos los cambios se registran en audit_log
4. **Permisos:** Los endpoints admin requieren rol de administrador

---

## 📦 DEPENDENCIAS INSTALADAS

```
pdfkit - Generación de PDFs
exceljs - Exportación a Excel
decimal.js - Cálculos precisos con dinero
winston - Sistema de logging
jsonwebtoken - Autenticación avanzada
multer - Manejo de archivos
```

---

## 🚀 FRONTEND - PÁGINA DE REPORTES

**URL:** `/reports.html`

**Funcionalidades:**

- 📋 **Tab Nómina:** Generar PDF y Excel de nómina
- 💰 **Tab Pagos:** Historial de pagos filtrable
- 🔍 **Tab Auditoría:** Registro de cambios
- 📈 **Tab Análisis:** Proyecciones y análisis
- 💸 **Tab Retenciones:** Cálculo de ISR, AFP, SFS

---

## 🎯 MEJORAS IMPLEMENTADAS

✅ Migraciones completas de base de datos
✅ 19 endpoints REST nuevos
✅ Cálculos financieros precisos con Decimal.js
✅ Generación de PDFs profesionales
✅ Exportación a Excel con estilos
✅ Sistema completo de auditoría
✅ Gestión de departamentos
✅ Filtros avanzados de empleados
✅ Cálculos automáticos de retenciones (RD)
✅ Proyección de nómina
✅ Logging con Winston
✅ Interfaz profesional en reportes.html

---

**Versión:** 2.0.0
**Última Actualización:** 25 de Diciembre, 2025
