# 🧪 GUÍA DE PRUEBAS - SISTEMA DE CONTROL CENTER

## 🚀 INICIO

### 1. Asegurate que el servidor esté corriendo:

```powershell
cd backend
node server.js
```

El servidor debe mostrar:

```
Servidor ejecutándose en puerto 3000
Conectado a PostgreSQL
```

### 2. Abre el navegador en:

```
http://localhost:3000/login.html
```

---

## 📋 CASOS DE PRUEBA

### ✅ PRUEBA 1: Login como Administrador

**Pasos:**

1. Abre http://localhost:3000/login.html
2. Ingresa:
   - **Código de Empleado:** 2002
   - **Contraseña:** adminpassword
3. Click en "Iniciar Sesión"

**Resultado esperado:**

- ✓ Alert "Bienvenido, Ana García!"
- ✓ Redirección a http://localhost:3000/admin-nuevo.html
- ✓ Se carga lista de empleados con tarjetas

---

### ✅ PRUEBA 2: Panel de Administrador - Ver Lista de Empleados

**En admin-nuevo.html:**

**Pasos:**

1. Verifica que se cargan las tarjetas de empleados
2. Cada tarjeta debe mostrar:

   - Foto de perfil (avatar)
   - ID del empleado
   - Nombre
   - Posición/cargo
   - Salario mensual
   - Salario diario
   - Horas de trabajo por día
   - 3 botones: Ver Detalles, Editar, Eliminar

3. Busca un empleado por nombre o ID en el campo de búsqueda

**Resultado esperado:**

- ✓ Se muestran 4 empleados (Juan, María, Pedro, Ana)
- ✓ Todos tienen avatar, datos y botones visibles
- ✓ La búsqueda filtra resultados en tiempo real
- ✓ Se ven las estadísticas: Total empleados, Salario promedio, Nómina total

---

### ✅ PRUEBA 3: Panel de Administrador - Ver Detalles de Empleado

**En admin-nuevo.html:**

**Pasos:**

1. Haz click en "Ver Detalles" de cualquier empleado
2. En el modal que se abre, verifica:
   - Foto de perfil grande
   - Información completa (ID, nombre, posición, rol, fecha inicio, etc.)
   - Gráfico de línea con tendencia de ingresos
   - Tabla con registros diarios de ingresos (fecha, horas, monto)
   - Estadísticas: Días trabajados, Horas/día, Ingreso total, Registros

**Resultado esperado:**

- ✓ El modal muestra todos los datos del empleado
- ✓ El gráfico se dibuja correctamente con datos
- ✓ La tabla lista los ingresos diarios (debe haber ~20 registros)
- ✓ Se pueden cerrar el modal con la X

---

### ✅ PRUEBA 4: Panel de Administrador - Crear Nuevo Empleado

**En admin-nuevo.html:**

**Pasos:**

1. Haz click en el botón "+ Agregar Empleado"
2. Se abre un modal con formulario
3. Completa los campos:

   - Nombre: "Test Empleado"
   - Cédula/ID: "9999"
   - Contraseña: "test123"
   - Salario Mensual: "3000"
   - Posición: "Asistente"
   - Fecha de Inicio: (Selecciona una fecha)
   - Horas por Día: "8"

4. Haz click en "Guardar"

**Resultado esperado:**

- ✓ Se cierra el modal
- ✓ La lista se actualiza
- ✓ Aparece la nueva tarjeta de empleado al final
- ✓ El nuevo empleado tiene todos los datos guardados
- ✓ Se puede ver con click en "Ver Detalles"

---

### ✅ PRUEBA 5: Panel de Administrador - Editar Empleado

**En admin-nuevo.html:**

**Pasos:**

1. Haz click en "Editar" de cualquier empleado
2. Se abre el modal con los datos pre-cargados
3. Cambia algún campo (ej: nombre o salario)
4. Haz click en "Guardar"

**Resultado esperado:**

- ✓ Se cierra el modal
- ✓ La tarjeta del empleado se actualiza
- ✓ Los cambios se reflejan inmediatamente
- ✓ Los gráficos se actualizan si cambió el salario

---

### ✅ PRUEBA 6: Panel de Administrador - Eliminar Empleado

**En admin-nuevo.html:**

**Pasos:**

1. Haz click en "Eliminar" de un empleado
2. Se muestra un confirm "¿Estás seguro?"
3. Confirma la eliminación

**Resultado esperado:**

- ✓ El empleado se elimina de la lista
- ✓ La tarjeta desaparece
- ✓ Los gráficos se actualizan (estadísticas cambian)
- ✓ Se puede deshacer recargando la página

---

### ✅ PRUEBA 7: Gráficos del Panel Admin

**En admin-nuevo.html:**

**Pasos:**

1. Verifica el gráfico de "Distribución de Salarios" (barras)
2. Verifica el gráfico de "Ganancias Mensuales" (línea)
3. Intenta hacer hover sobre los gráficos

**Resultado esperado:**

- ✓ Se muestran ambos gráficos correctamente
- ✓ Los datos coinciden con los salarios de empleados
- ✓ Al hacer hover, se muestran valores en tooltip
- ✓ Si agregas/eliminas empleados, los gráficos se actualizan

---

### ✅ PRUEBA 8: Login como Empleado

**Pasos:**

1. Vuelve a http://localhost:3000/login.html
2. Ingresa:
   - **Código de Empleado:** 1001
   - **Contraseña:** password123
3. Click en "Iniciar Sesión"

**Resultado esperado:**

- ✓ Alert "Bienvenido, Juan Pérez!"
- ✓ Redirección a http://localhost:3000/employee-profile.html
- ✓ Se carga el perfil del empleado

---

### ✅ PRUEBA 9: Panel de Empleado - Ver Perfil Personal

**En employee-profile.html:**

**Pasos:**

1. Verifica que se muestre:

   - Foto de perfil grande
   - Nombre y posición
   - ID de empleado
   - Rol (Employee)
   - Fecha de inicio en la empresa

2. Busca las tarjetas de estadísticas:
   - Días trabajados desde inicio
   - Horas de trabajo por día
   - Ingreso total acumulado
   - Número de registros de ingreso

**Resultado esperado:**

- ✓ Todos los datos son visibles y correctos
- ✓ Las estadísticas se calculan correctamente
- ✓ La foto se muestra como avatar
- ✓ No hay botones de editar (es solo lectura)

---

### ✅ PRUEBA 10: Panel de Empleado - Ver Gráfico de Ingresos

**En employee-profile.html:**

**Pasos:**

1. Busca el gráfico de línea "Tendencia de Ingresos"
2. El gráfico debe mostrar los últimos ingresos diarios
3. Haz hover sobre los puntos del gráfico

**Resultado esperado:**

- ✓ Se dibuja el gráfico con datos del empleado
- ✓ Muestra múltiples puntos (uno por cada día trabajado)
- ✓ Los valores son correctos (montos de ingresos diarios)
- ✓ El tooltip muestra fecha y monto al hacer hover

---

### ✅ PRUEBA 11: Panel de Empleado - Ver Tabla de Ingresos

**En employee-profile.html:**

**Pasos:**

1. Desplázate hacia abajo hasta encontrar la tabla "Ingresos Recientes"
2. Verifica que se listen:
   - Fecha del ingreso
   - Horas trabajadas ese día
   - Monto del ingreso
3. Scroll para ver múltiples registros

**Resultado esperado:**

- ✓ Se muestra tabla con todos los ingresos diarios
- ✓ Cada fila tiene: Fecha, Horas, Monto
- ✓ Los datos coinciden con los del gráfico
- ✓ Se puede ver historial de hasta 30 días
- ✓ No hay botones para editar (es solo lectura)

---

### ✅ PRUEBA 12: Acceso Denegado para Empleados

**En employee-profile.html:**

**Pasos:**

1. Intenta acceder directamente a:
   ```
   http://localhost:3000/admin-nuevo.html
   ```
2. Sin estar logueado como admin

**Resultado esperado:**

- ✓ La página detecta que no eres admin
- ✓ Se redirige a login.html
- ✓ Se muestra mensaje de error

---

## 🐛 TROUBLESHOOTING

### Problema: "Cannot GET /admin-nuevo.html"

**Solución:** Asegurate que el servidor esté corriendo y en la carpeta correcta

### Problema: Gráficos no se muestran

**Solución:** Abre la consola (F12) y busca errores. Chart.js debe estar cargado

### Problema: Los datos no cargan en las tarjetas

**Solución:** Verifica que PostgreSQL esté corriendo y la BD sea accesible

### Problema: Login falla incluso con credenciales correctas

**Solución:** Verifica que el servidor backend esté corriendo (node server.js)

### Problema: Las fotos no se ven

**Solución:** Es normal al principio. Se generan automáticamente con gravatar

---

## 📊 DATOS DISPONIBLES PARA PRUEBAS

### Administrador:

- **ID:** 2002
- **Contraseña:** adminpassword
- **Nombre:** Ana García

### Empleados:

1. **ID:** 1001 | **Contraseña:** password123 | **Nombre:** Juan Pérez
2. **ID:** 1002 | **Contraseña:** password123 | **Nombre:** María López
3. **ID:** 1003 | **Contraseña:** password123 | **Nombre:** Pedro García
4. **ID:** 1004 | **Contraseña:** password123 | **Nombre:** Ana García (empleado)

---

## ✨ CHECKLIST FINAL

- [ ] Login funcionando para admin
- [ ] Login funcionando para empleado
- [ ] Panel admin muestra lista de empleados
- [ ] Panel admin permite crear, editar, eliminar
- [ ] Gráficos de admin se actualizan
- [ ] Panel empleado muestra perfil personal
- [ ] Gráfico de ingresos del empleado funciona
- [ ] Tabla de ingresos diarios se carga
- [ ] No se puede acceder a admin siendo empleado
- [ ] Las fotos/avatares se ven en tarjetas
- [ ] Búsqueda funciona en panel admin
- [ ] Modal de detalles muestra gráfico y tabla
