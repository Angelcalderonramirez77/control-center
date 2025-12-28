# 🎯 GUÍA VISUAL - CÓMO USAR TODAS LAS NUEVAS FEATURES

## 📍 UBICACIÓN DEL BOTÓN DE REPORTES

```
HEADER DEL ADMIN
┌─────────────────────────────────────────────────────────────────────┐
│ 🏢 Panel de Administración                                          │
│                                                                     │
│                    👤 ADM                                          │
│               ANGEL CALDERONRAMIREZ                                │
│                                                                     │
│    👥 Ver Empleados  ➕ Agregar Empleado  📊 REPORTES  🚪 Salir   │
│                                           ^^^^^^^^^^^^^^            │
│                                         BOTÓN NUEVO               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 PASO A PASO: GENERAR UN REPORTE PDF DE NÓMINA

### Paso 1: Click en "📊 Reportes"

- Ubicado en el header del panel administrativo
- Te lleva a la página de reportes (reports.html)

### Paso 2: Página de Reportes Abre

```
┌─────────────────────────────────────────────────────────────────────┐
│ 📊 Centro de Reportes                                    ← Volver   │
│                                                           Logout     │
├─────────────────────────────────────────────────────────────────────┤
│ [📋 Nómina] [💰 Pagos] [🔍 Auditoría] [📈 Análisis] [💸 Retenciones]
├─────────────────────────────────────────────────────────────────────┤
│ REPORTES DE NÓMINA                                                  │
│                                                                     │
│ Mes y Año: [2025-01              ]                                 │
│ Empleado:  [Buscar por nombre...]                                  │
│                                                                     │
│ [📄 Generar PDF] [📊 Exportar Excel] [👁️ Vista Previa]            │
│                                                                     │
│ (Aquí aparece la vista previa)                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Paso 3: Seleccionar Mes y Datos

- Selecciona el mes/año del que deseas reportes
- Opcionalmente busca un empleado específico
- Click en "📄 Generar PDF"

### Paso 4: Descarga Automática

- El PDF se descarga automáticamente
- Nombre: `nomina_2025-01.pdf`
- Contiene tabla con salarios, bonos, descuentos, neto
- Incluye ISR, AFP, SFS para cada empleado
- Resumen de retenciones al final

---

## 💰 PASO A PASO: VER HISTORIAL DE PAGOS

### Paso 1: Click en Tab "💰 Pagos"

```
[📋 Nómina] [💰 PAGOS] [🔍 Auditoría] [📈 Análisis] [💸 Retenciones]
                ▲
                Click aquí
```

### Paso 2: Filtrar Datos

```
Fecha Desde: [2025-01-01      ]
Fecha Hasta: [2025-01-31      ]
Empleado:    [402-0047666-7   ]

[🔍 Buscar]
```

### Paso 3: Ver Resultados

```
Tabla con columnas:
┌────────────┬─────────────┬──────────┬───────┬──────────┬────────┬────────┐
│ Cédula     │ Fecha Pago  │ Salario  │ Bonos │ Desc.    │ Neto   │ Método │
├────────────┼─────────────┼──────────┼───────┼──────────┼────────┼────────┤
│ 402-00...7 │ 15/01/2025  │ RD$ 50K │ RD$ 5K │ RD$ 2.5K │ RD$ 52.5K │ TRANSF │
├────────────┼─────────────┼──────────┼───────┼──────────┼────────┼────────┤
│ ...        │ ...         │ ...      │ ...   │ ...      │ ...    │ ...    │
└────────────┴─────────────┴──────────┴───────┴──────────┴────────┴────────┘

Totales:
┌─────────────┐  ┌──────────┐  ┌───────────────┐  ┌──────────────┐
│ Salario     │  │ Bonos    │  │ Descuentos    │  │ Neto Total   │
│ RD$ XXX,XXX │  │ RD$ XX,XXX │  │ RD$ XX,XXX    │  │ RD$ XXX,XXX  │
└─────────────┘  └──────────┘  └───────────────┘  └──────────────┘
```

---

## 🔍 PASO A PASO: VER REGISTRO DE AUDITORÍA

### Paso 1: Click en Tab "🔍 Auditoría"

### Paso 2: Filtrar por Tipo de Acción

```
Tipo de Acción: [CREATE, UPDATE, DELETE ▼]
Fecha Desde:    [2025-01-01            ]
Fecha Hasta:    [2025-01-31            ]

[📋 Cargar]
```

### Paso 3: Ver Cambios Realizados

```
┌──────────────────────────────────────────────────────┐
│ UPDATE - employees                                   │
│ ────────────────────────────────────────────────────│
│ Fecha: 25/12/2025 14:30:45                         │
│ Admin: 402-0047666-7                               │
│ Empleado: 401-1234567-8                            │
│ Cambios: salary, department_id, position           │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ CREATE - payment_history                             │
│ ────────────────────────────────────────────────────│
│ Fecha: 25/12/2025 10:15:30                         │
│ Admin: 402-0047666-7                               │
│ Empleado: 403-9876543-2                            │
│ Cambios: Nuevo pago registrado                     │
└──────────────────────────────────────────────────────┘
```

---

## 📈 PASO A PASO: PROYECTAR NÓMINA FUTURA

### Paso 1: Click en Tab "📈 Análisis"

### Paso 2: Section "Proyección de Nómina"

```
Proyectar para: [2025-02]

[🔮 Proyectar]
```

### Paso 3: Ver Proyección

```
┌────────────┐  ┌──────────────────┐  ┌──────────────┐  ┌─────────────┐
│ Empleados  │  │ Masa Salarial    │  │ Retenciones  │  │ Costo Neto  │
│ 10         │  │ RD$ 550,000.00   │  │ RD$ 77,000   │  │ RD$ 473,000 │
└────────────┘  └──────────────────┘  └──────────────┘  └─────────────┘

Detalles por Empleado:
┌────────────┬──────────────┬──────────────┬──────────────┐
│ Cédula     │ Salario      │ Retenciones  │ Neto         │
├────────────┼──────────────┼──────────────┼──────────────┤
│ 402-00...7 │ RD$ 55,000   │ RD$ 7,687.50 │ RD$ 47,312.50│
│ 401-12...8 │ RD$ 45,000   │ RD$ 6,318.75 │ RD$ 38,681.25│
│ ...        │ ...          │ ...          │ ...          │
└────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 💸 PASO A PASO: CALCULAR RETENCIONES

### Paso 1: Click en Tab "💸 Retenciones"

### Paso 2: Ingresar Datos

```
Empleado: [402-0047666-7      ] (opcional)
Salario:  [50000.00           ]

[💰 Calcular]
```

### Paso 3: Ver Desglose

```
┌──────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Salario Base │  │ ISR      │  │ AFP      │  │ SFS      │
│ RD$ 50,000   │  │ RD$ 5,000│  │ RD$ 1,250│  │ RD$ 1,435│
└──────────────┘  └──────────┘  └──────────┘  └──────────┘

┌──────────────────────┐  ┌──────────────────┐
│ Total Retenciones    │  │ Salario Neto     │
│ RD$ 7,687.50         │  │ RD$ 42,312.50    │
└──────────────────────┘  └──────────────────┘
```

---

## 📊 OTRAS FUNCIONES EN EL PANEL ADMIN

### Gestión de Empleados

- 👥 Ver Empleados: Scroll y buscar
- ➕ Agregar Empleado: Abre modal con formulario
- 📝 Editar: Click en empleado para editar
- 🗑️ Eliminar: Confirmar eliminación

### Gráficos Interactivos

- 📊 Distribución de Salarios: Barras, Línea, Área, Circular
- 📈 Ganancias Mensuales: Línea, Barras, Área, Circular
- Cambiar tipo de gráfico con botones arriba

### Estadísticas

- Empleados Totales
- Salario Promedio
- Masa Salarial Mensual

---

## 🎨 INTERFAZ VISUAL

### Dark Theme Profesional

```
Header:     Azul oscuro (#0f172a)
Fondo:      Gris muy oscuro (#1a1f2e)
Cards:      Gris oscuro (#2d3748)
Reportes:   Blanco (#ffffff)
Acentos:    Azul (#667eea), Oro (#fbbf24)
Texto:      Blanco/Gris claro
```

### Colores por Estado

```
CREATE:   Verde   (#27ae60)
UPDATE:   Naranja (#f39c12)
DELETE:   Rojo    (#e74c3c)
SUCCESS:  Verde   (#27ae60)
ERROR:    Rojo    (#e74c3c)
INFO:     Azul    (#667eea)
```

---

## 📱 RESPONSIVE DESIGN

- Desktop: Diseño completo con múltiples columnas
- Tablet: Columnas se ajustan
- Móvil: Stack vertical, botones a ancho completo

---

## 🔐 SEGURIDAD EN REPORTES

✅ Todos los reportes requieren autenticación
✅ Solo administradores pueden generar reportes
✅ Los datos se filtran por permisos
✅ Todos los accesos se registran en auditoría
✅ Las descargas se registran en logs

---

## ⚡ ATAJOS ÚTILES

**Búsqueda Rápida:** Ctrl+F
**Descargar PDF:** Click en botón 📄
**Descargar Excel:** Click en botón 📊
**Volver al Admin:** Click en "← Volver al Panel"
**Logout:** Click en "🚪 Cerrar Sesión"

---

## 🆘 SOLUCIÓN DE PROBLEMAS COMUNES

### "No veo el botón de reportes"

- Verificar que estés logueado como admin
- Recargar la página (F5)
- Limpiar caché (Ctrl+Shift+Delete)

### "El PDF no se descarga"

- Permitir descargas en el navegador
- Verificar que los puertos están abiertos
- Revisar la consola (F12 → Console)

### "Las tablas se ven vacías"

- Asegúrate de seleccionar un mes con datos
- Verifica que existen registros de pago para ese período
- Intenta con otro mes

### "Los cálculos se ven incorrectos"

- Los cálculos usan Decimal.js para precisión
- Verifica que el salario esté en formato correcto
- Las tasas de AFP y SFS son fijas

---

¡Listo! Ahora puedes usar todas las nuevas características de Control Center Pro v2.0 🚀
