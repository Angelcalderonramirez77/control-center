# DOCUMENTACIÓN DEL PROYECTO

## Control Center - Sistema de Gestión de Nómina

---

## 1. NOMBRE DEL PROYECTO

### Control Center

---

## 2. DESCRIPCIÓN DEL PROYECTO

Este proyecto estará dirigido específicamente al control de nómina de una empresa, donde se gestionarán los datos de los empleados, quienes serán los usuarios del sistema. Cada empleado podrá acceder a la interfaz mediante su código de empleado y consultar su salario, que se pagará dos veces al mes.

Además, el sistema mostrará estadísticas de los empleados, clasificando los salarios en rangos, por ejemplo: de 5,000 a 10,000, de 10,000 a 20,000, y así sucesivamente. También presentará estadísticas de las ganancias de la empresa por mes, las cuales influirán en la determinación de los bonos o propina legal de los empleados.

**Características Principales:**

- Portal de empleados con acceso a información salarial
- Panel administrativo completo para gestión de nómina
- Estadísticas y reportes de salarios por rangos
- Análisis de ganancias mensuales de la empresa
- Cálculo automático de bonos y propinas legales
- Cumplimiento normativo de República Dominicana

---

## 3. OBJETIVOS DEL PROYECTO

### A. Objetivo General

Desarrollar un panel de administración web funcional y fácil de usar que permita gestionar de manera eficiente la información y los usuarios del sistema, optimizando las operaciones internas mediante una interfaz clara y moderna.

### B. Objetivos Específicos

1. **Diseñar una interfaz intuitiva y fácil de usar** para administrar todas las secciones del panel.

2. **Implementar módulos completos de gestión** de usuarios y manejo de información mediante tablas y formularios dinámicos.

3. **Integrar visualizaciones estadísticas**, como gráficos y reportes, para facilitar el análisis de datos.

4. **Garantizar un sistema compatible, de buen rendimiento, flexible y escalable** para futuras mejoras.

---

## 4. ANÁLISIS DE PREGUNTAS FUNDAMENTALES

### 4.1 ¿Qué es el desarrollo centrado en el usuario y por qué es crítico?

El desarrollo centrado en el usuario (DCU) es una metodología que coloca al usuario final en el centro del proceso de diseño y construcción de sistemas.

Se trata de diseñar interfaces y funcionalidades basadas en las necesidades, expectativas y comportamientos reales de los usuarios, en lugar de enfocarse únicamente en requisitos técnicos.

**Importancia Crítica:**

- Reduce rechazos y mejora adopción del sistema
- Minimiza errores y mejora la experiencia
- Aumenta la productividad de los usuarios
- Genera confianza en la herramienta
- Disminuye costos de capacitación y soporte

### 4.2 Principios Fundamentales del Diseño de GUI Efectiva

Una interfaz gráfica de usuario efectiva debe cumplir con ciertos principios clave:

#### Simplicidad

- Evitar sobrecargar la pantalla con elementos innecesarios
- Menos es más: mostrar solo lo esencial para la tarea
- Reducir opciones complejas a selecciones simples

#### Consistencia

- Uso uniforme de colores, tipografía y estilos de botones
- Los patrones de interacción deben repetirse para que el usuario los reconozca fácilmente
- Mantener el mismo lenguaje visual en toda la aplicación

#### Usabilidad

- La interfaz debe ser intuitiva, permitiendo que los usuarios realicen tareas sin esfuerzo
- Jerarquía visual clara para guiar la atención
- Navegación lógica y predecible

#### Retroalimentación Inmediata

- El sistema debe responder con mensajes claros (ejemplo: confirmaciones, alertas de error)
- Esto genera confianza y reduce la incertidumbre
- Estados de carga visibles durante operaciones

#### Accesibilidad

- Interfaces inclusivas que puedan ser utilizadas por personas con diferentes capacidades
- Contrastes adecuados, soporte para lectores de pantalla y navegación por teclado
- Cumplimiento de estándares WCAG

#### Flexibilidad y Eficiencia

- Permitir atajos y personalización para usuarios avanzados
- Optimizar flujos de trabajo frecuentes
- Adaptación a diferentes velocidades y estilos de trabajo

---

## 5. REQUERIMIENTOS TÉCNICOS DE PLATAFORMA PARA DISEÑO GUI

### 5.1 Descripción General

Control Center es una interfaz web para gestionar la nómina de una empresa. Permitirá a los empleados consultar su salario usando su código de empleado y a los administradores manejar datos, usuarios y estadísticas del sistema.

### 5.2 Requerimientos Técnicos

#### Frontend

- **Tecnologías:** HTML5, CSS3, JavaScript Vanilla
- **Características:** Diseño responsivo, tablas dinámicas, formularios claros y visualizaciones estadísticas
- **Interfaz:** Intuitiva y de fácil navegación

#### Backend

- **Entorno:** Node.js con Express.js
- **Arquitectura:** API REST
- **Funcionalidades:** Autenticación, consultas salariales, gestión de empleados
- **Seguridad:** Validación de datos y manejo seguro de sesiones

#### Base de Datos

- **Sistema:** PostgreSQL (relacional)
- **Tablas:** Empleados, salarios, roles, pagos, retenciones
- **Características:** Respaldos automáticos y control de integridad

#### Control de Versiones

- **Herramienta:** Git + GitHub
- **Funcionalidad:** Manejo de ramas, historial y colaboración del equipo

#### Despliegue

- **Containerización:** Docker
- **Hosting:** Configurado para AWS
- **Características:** Seguridad, escalabilidad y disponibilidad

#### Seguridad

- **Autenticación:** Bcrypt para hash de contraseñas
- **Control de Permisos:** Role-based access control (RBAC)
- **Protección:** Anti SQL Injection, XSS prevention
- **Datos Sensibles:** Encriptación de información salarial

#### Rendimiento

- **Cargas Rápidas:** Optimización de activos
- **Consultas Eficientes:** Índices en BD
- **Escalabilidad:** Arquitectura preparada para crecer

---

## 6. REQUERIMIENTOS TÉCNICOS Y SU IMPLICACIÓN EN DISEÑO GUI

### 6.1 HTML, CSS, JavaScript

**Flexibilidad y Modernidad:**

- Las tecnologías vanilla permiten total libertad de diseño
- Interfaces modernas alineadas con identidad corporativa
- JavaScript es esencial para interactividad de tablas y gráficos

**Sistema de Diseño (Design System):**

- Conjunto de componentes reutilizables: botones, tarjetas, modals, inputs
- Garantiza consistencia en todo el panel administrativo
- Reduce tiempo de desarrollo y curva de aprendizaje

### 6.2 Diseño Responsivo

**Acceso Universal:**

- Accesible en pantallas pequeñas
- Información de nómina legible en dispositivos móviles
- Experiencia sin fricciones en todos los dispositivos

**Puntos de Quiebre (Breakpoints):**

- Desktop: Tablas de datos completas
- Tablet: Optimización intermedia
- Móvil: Tarjetas informativas, swipe lateral
- Priorizar función principal en móvil

### 6.3 Tablas Dinámicas y Formularios

**Eficiencia en la Gestión:**

- Controles avanzados: filtros en tiempo real
- Ordenamiento por columna (ascendente/descendente)
- Paginación para evitar sobrecarga visual

**Validación de Formularios:**

- Validación in situ de campos
- Retroalimentación inmediata
- Mensajes de error claros y útiles

### 6.4 Visualizaciones Estadísticas

**Claridad Analítica:**

- Gráficos de barras para clasificación de salarios por rangos
- Gráficos de líneas para ganancias mensuales (tendencia temporal)
- Selección cuidadosa según tipo de dato

**Accesibilidad y Contexto:**

- Contrastes adecuados para accesibilidad
- Etiquetas claras y títulos descriptivos
- Opción de exportar datos a PDF o CSV

---

## 7. INTERACCIÓN DE LA PLATAFORMA CON LA LÓGICA DE NEGOCIO

### 7.1 Backend (Node.js y API REST)

**Diseño Basado en Flujo:**

- Cada elemento de interfaz mapea directamente a acción en API
- Botones conectados a endpoints específicos
- Estructura de panel refleja endpoints del API
- Desarrollo coherente entre frontend y backend

**Endpoints Principales:**

- `GET /api/employees` - Listar empleados
- `GET /api/employees/:id/income` - Ingresos de empleado
- `GET /api/payments/history` - Historial de pagos
- `POST /api/payroll/calculate` - Calcular retenciones
- `GET /api/reports/salary-growth` - Análisis de salarios

### 7.2 Base de Datos (PostgreSQL)

**Eficiencia de la Consulta:**

- Consultas optimizadas con índices
- Estados de carga amigables durante operaciones
- Uso de skeletons o spinners
- Retroalimentación inmediata al usuario

**Integridad de Datos:**

- Validación en múltiples niveles
- Transacciones ACID
- Respaldos automáticos

---

## 8. SEGURIDAD Y ARQUITECTURA

### 8.1 Seguridad en la GUI

**Autenticación y Control de Permisos:**
El sistema tiene dos vistas principales con autenticación separada:

1. **Portal de Empleado:**

   - Acceso limitado a su salario y datos personales
   - Visualización de registros de ingreso diario
   - Consulta de reportes personales

2. **Panel de Administrador:**
   - Acceso total a gestión de usuarios
   - Edición de datos salariales
   - Visualización de estadísticas globales
   - Generación de reportes

**Principios de Seguridad en GUI:**

- Ocultar funcionalidades de admin al usuario empleado
- Mínima Revelación: solo mostrar elementos permitidos
- Consistencia: no mostrar opciones innecesarias
- Navegación clara según rol

### 8.2 Despliegue (Docker y AWS)

**Pruebas de Integración:**

- Docker facilita replicación de ambiente
- Testing idéntico al de producción
- Validación de GUI en ambiente real
- Mantenimiento de diseño y rendimiento

### 8.3 Rendimiento y Escalabilidad

**Optimización de Activos:**

- Compresión de JavaScript y CSS
- Implementación de caching del navegador
- Cargas rápidas en primera interacción
- Subsiguientes interacciones casi instantáneas

---

## 9. DIRECTRICES DE DISEÑO DE GUI

### 9.1 Aplicación de Principios

#### Simplicidad

- Portal de empleado: consulta salarial lo más simple posible
- Información clave prioritaria (salario, fecha de pago)
- Eliminación de elementos innecesarios
- Navegación directa a funciones principales

#### Consistencia

- Paleta de colores única y coherente
- Mismos estilos de botones/tarjetas en todas secciones
- Lenguaje visual uniforme
- Facilita reconocimiento y aprendizaje

#### Usabilidad y Jerarquía Visual

- Tamaño de fuente diferenciado por importancia
- Contraste para dirigir la atención
- Ubicación estratégica de elementos clave
- Estadísticas principales como elementos visuales prominentes

#### Retroalimentación Inmediata

- Mensajes claros tras cada acción crítica
- Confirmaciones de éxito ("¡Salario actualizado con éxito!")
- Alertas de error descriptivas ("Error: código de empleado incorrecto")
- Reducción de incertidumbre del usuario

#### Accesibilidad

- Interfaces inclusivas para todos
- Contrastes adecuados (WCAG compliance)
- Soporte para lectores de pantalla
- Navegación por teclado completamente funcional

#### Flexibilidad y Eficiencia

- Atajos para usuarios avanzados
- Personalización de vistas
- Optimización de flujos frecuentes
- Adaptación a diferentes estilos de trabajo

---

## 10. DESCRIPCIÓN DE ELEMENTOS DEL PROYECTO CON PROCESOS BÁSICOS

### 10.1 Módulos Principales

#### A. Módulo de Autenticación

- **Función:** Validar credenciales de usuarios
- **Proceso:**
  1. Usuario ingresa cédula y contraseña
  2. Sistema valida contra base de datos
  3. Crea sesión segura
  4. Redirige a portal correspondiente

#### B. Módulo de Gestión de Empleados

- **Función:** CRUD de empleados
- **Proceso:**
  1. Admin accede a lista de empleados
  2. Puede crear, actualizar o eliminar
  3. Sistema valida datos
  4. Registra cambios en auditoría

#### C. Módulo de Nómina

- **Función:** Cálculo y gestión de pagos
- **Proceso:**
  1. Admin ingresa datos de pago
  2. Sistema calcula retenciones (ISR, AFP, SFS)
  3. Genera recibos y reportes
  4. Registra en historial de pagos

#### D. Módulo de Reportes

- **Función:** Análisis y visualización de datos
- **Proceso:**
  1. Usuario selecciona período y filtros
  2. Sistema consulta base de datos
  3. Genera gráficos y estadísticas
  4. Permite exportar a PDF/Excel

#### E. Módulo de Empleado

- **Función:** Consulta de información personal
- **Proceso:**
  1. Empleado accede a su perfil
  2. Visualiza salario y datos personales
  3. Consulta historial de pagos
  4. Ve registros de ingreso diario

---

## 11. DESCRIPCIÓN DE FORMULARIOS Y CONTROLES

### 11.1 Formularios del Sistema

#### Formulario de Login (Empleado)

**Campos:**

- Cédula de Empleado (input number, requerido)
- Contraseña (input password, requerido)

**Controles:**

- Botón "Acceder"
- Link "Recuperar contraseña"
- Validación de formato de cédula

#### Formulario de Agregar Empleado

**Campos:**

- Cédula (text, formato XXX-XXXXXXX-X)
- Nombre Completo (text, requerido)
- Rol (select dropdown)
- Posición (text)
- Salario Mensual (number, decimal)
- Fecha de Inicio (date)
- Horas por Día (number)

**Controles:**

- Botón "Guardar"
- Botón "Cancelar"
- Validación en tiempo real
- Feedback inmediato de errores

#### Formulario de Registrar Pago

**Campos:**

- Empleado (select con búsqueda)
- Fecha de Pago (date)
- Salario Base (number, requerido)
- Bonos (number, opcional)
- Descuentos (number, opcional)
- Método de Pago (select)

**Controles:**

- Botón "Registrar Pago"
- Preview de retenciones
- Cálculo automático de neto
- Validación de montos

#### Formulario de Búsqueda de Pagos

**Campos:**

- Rango de Fechas (date range)
- Cédula de Empleado (text)
- Estado (select)

**Controles:**

- Botón "Buscar"
- Botón "Limpiar"
- Resultados dinámicos
- Paginación automática

### 11.2 Controles Específicos

#### Tablas Dinámicas

- Ordenamiento por columna (click en header)
- Filtrado en tiempo real
- Paginación con navegación
- Selección múltiple (checkboxes)
- Acciones por fila (editar, eliminar, ver detalles)

#### Selectores y Dropdowns

- Búsqueda dentro del dropdown
- Opciones categorizadas
- Valores por defecto lógicos
- Validación de selección

#### Input Numbers

- Validación de formato
- Límites mínimos/máximos
- Símbolos de moneda cuando aplica
- Decimal support para salarios

#### Date Pickers

- Calendario interactivo
- Formato consistente (DD/MM/YYYY)
- Validación de rango
- Presets rápidos (hoy, últimos 30 días)

#### Alerts y Notifications

- Confirmación antes de acciones destructivas
- Mensajes de éxito (verde)
- Mensajes de error (rojo)
- Mensajes informativos (azul)
- Auto-cierre después de 5 segundos

---

## 12. DISEÑO DE INTERFACES (FRONT END)

### 12.1 Elementos Visuales Principales

#### Paleta de Colores

- **Primario:** #667eea (Púrpura)
- **Secundario:** #764ba2 (Púrpura oscuro)
- **Éxito:** #27ae60 (Verde)
- **Error:** #e74c3c (Rojo)
- **Advertencia:** #f39c12 (Naranja)
- **Información:** #3498db (Azul)
- **Fondo:** #f8f9fa (Gris claro)
- **Texto:** #333333 (Gris oscuro)

#### Tipografía

- **Fuente Principal:** Segoe UI, Tahoma, sans-serif
- **Tamaños:**
  - H1: 32px, bold
  - H2: 24px, bold
  - H3: 18px, bold
  - Body: 14px, regular
  - Small: 12px, regular

#### Espaciado

- **Padding:** 8px, 12px, 16px, 24px, 32px (escala)
- **Margin:** Mismo sistema de escala
- **Gap (Flex/Grid):** 12px, 16px, 20px, 24px

#### Bordes y Sombras

- **Border Radius:** 4px (inputs), 8px (cards), 50% (avatares)
- **Shadow:** 0 2px 10px rgba(0,0,0,0.1) (elevado)
- **Shadow Hover:** 0 4px 15px rgba(0,0,0,0.15)

### 12.2 Componentes Principales

#### Header/Navbar

- Logo de empresa a la izquierda
- Navegación central (si corresponde)
- Usuario actual a la derecha
- Botón "Cerrar Sesión"
- Altura: 60px
- Fondo: blanco con borde inferior sutil

#### Tarjetas de Información

- Fondo: blanco
- Border radius: 8px
- Padding: 16px
- Shadow: sutil
- Títulos en H3
- Valores destacados en color primario

#### Botones

- **Primary:** Fondo #667eea, texto blanco
- **Secondary:** Borde #667eea, texto #667eea
- **Danger:** Fondo #e74c3c, texto blanco
- **Padding:** 10px 16px
- **Border Radius:** 4px
- **Hover:** Cambio de sombra y transformación leve (translateY -2px)

#### Inputs y Textareas

- Borde: 1px solid #ddd
- Padding: 8px 12px
- Focus: Borde #667eea, shadow sutil
- Placeholder: color #999
- Validación: borde rojo en error, verde en éxito

#### Gráficos

- Chart.js para visualizaciones
- Leyendas debajo o al lado
- Colores alineados con paleta
- Tooltips en hover
- Responsive a cambios de tamaño

---

## 13. CONSTRUCCIÓN DE INTERFACES GRÁFICAS

### 13.1 Interfaz para Salidas (Outputs)

#### Dashboard Principal

**Componentes:**

- Tarjetas de estadísticas clave (empleados, salario total, pagos pendientes)
- Gráficos de distribución salarial
- Tabla de últimos pagos registrados
- Últimas acciones en auditoría

**Layout:**

- Grid de 4 columnas en desktop
- 2 columnas en tablet
- 1 columna en móvil
- Alto contraste para números importantes

#### Reportes

**Componentes:**

- Filtros avanzados en panel lateral
- Tabla de datos con opciones de exportación
- Gráficos analíticos
- Resumen ejecutivo al inicio

**Interactividad:**

- Click en fila para ver detalles
- Descarga de PDF/Excel
- Impresión amigable

#### Portal de Empleado

**Componentes:**

- Tarjeta de información personal (foto, nombre, rol, salario)
- Estadísticas personales (días trabajados, horas)
- Gráfico de ingresos (últimos 30 días)
- Tabla de registros de ingreso diario

**Información Mostrada:**

- Salario mensual y diario
- Total de ingresos acumulados
- Próxima fecha de pago
- Último pago registrado

### 13.2 Interfaz para Entradas (Inputs)

#### Formularios de Entrada

**Características:**

- Agrupación lógica de campos relacionados
- Labels claros y descriptivos
- Help text cuando sea necesario
- Validación en tiempo real
- Feedback visual inmediato

**Flujo de Usuario:**

1. Usuario completa campo
2. Validación automática
3. Ícono de checkmark si es correcto
4. Mensaje de error si hay problema
5. Botón guardar habilitado cuando es válido

#### Búsqueda y Filtros

**Componentes:**

- Input de búsqueda de texto
- Dropdowns para filtros categóricos
- Date range picker para períodos
- Checkboxes para selecciones múltiples

**Comportamiento:**

- Búsqueda en tiempo real (con debounce)
- Filtros que se aplican instantáneamente
- Opción de "Limpiar todo"
- Indicador de filtros activos

### 13.3 Interfaz para Encabezados

#### Headers de Sección

- Título principal (H1 o H2)
- Descripción breve si es compleja
- Botón de acción primaria (Agregar, Exportar, etc.)
- Navegación de breadcrumbs

**Estructura:**

```
[← Atrás] Nombre de Sección
Descripción o contexto adicional
                              [+ Botón Acción]
```

#### Headers de Tabla

- Nombre de columna
- Ícono de ordenamiento (⬍ ⬆ ⬇)
- Tooltip con descripción en hover
- Altura suficiente para legibilidad

---

## 14. PROCESOS BÁSICOS DEL SISTEMA

### 14.1 Proceso de Login

1. Usuario abre aplicación en http://localhost:3000
2. Sistema muestra pantalla de selección (Admin / Empleado)
3. Usuario selecciona su rol
4. Ingresa cédula sin guiones
5. Ingresa contraseña (cédula sin guiones)
6. Sistema valida credenciales
7. Si es correcto: Redirige a panel correspondiente
8. Si es incorrecto: Muestra error y permite reintentar

### 14.2 Proceso de Registro de Pago

1. Admin accede a "Registrar Pago"
2. Completa formulario con datos de pago
3. Sistema valida datos automáticamente
4. Sistema calcula retenciones (ISR, AFP, SFS)
5. Muestra preview del cálculo
6. Admin confirma el registro
7. Sistema guarda en base de datos
8. Muestra confirmación de éxito
9. Registra en auditoría

### 14.3 Proceso de Consulta de Salario (Empleado)

1. Empleado accede a su portal
2. Ve información salarial en tarjeta principal
3. Puede consultar "Historial de Pagos"
4. Puede ver "Registros de Ingreso Diario"
5. Puede descargar comprobantes de pago
6. Sistema registra que consultó estos datos

### 14.4 Proceso de Generación de Reportes

1. Admin selecciona tipo de reporte
2. Establece filtros (período, empleados, etc.)
3. Sistema ejecuta consultas optimizadas
4. Genera gráficos y estadísticas
5. Muestra preview del reporte
6. Admin puede exportar a PDF o Excel
7. Sistema registra generación en auditoría

---

## 15. ESPECIFICACIONES FINALES

### 15.1 Compatibilidad

- Chrome (versiones recientes)
- Firefox (versiones recientes)
- Safari (versiones recientes)
- Edge (versiones recientes)
- Responsive en pantallas de 320px a 4K

### 15.2 Performance

- Carga inicial: < 2 segundos
- Interactividad: < 100ms
- Transiciones: 300ms smooth
- API responses: < 500ms

### 15.3 Accesibilidad

- WCAG 2.1 AA compliant
- Contraste mínimo 4.5:1
- Navegación por teclado completa
- Soporte para lectores de pantalla

### 15.4 Seguridad

- HTTPS en producción
- Tokens de sesión seguros
- Protección contra XSS
- Protección contra CSRF
- Rate limiting en APIs

---

## 16. CONCLUSIÓN

El Control Center es un sistema integral de gestión de nómina que combina un diseño intuitivo y accesible con una arquitectura técnica robusta. La aplicación de principios de UX/UI garantiza que tanto empleados como administradores puedan interactuar eficientemente con el sistema, mejorando la productividad y reduciendo errores en la gestión de nómina.

El sistema está completamente funcional, escalable y listo para producción, con todas las medidas de seguridad y usabilidad implementadas según los estándares de la industria.

---

**Versión:** 1.0  
**Fecha:** 25 de diciembre de 2025  
**Estado:** Completado y Operacional
