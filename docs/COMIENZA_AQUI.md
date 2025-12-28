# 🚀 Control Center - Sistema de Nómina

## ¡Bienvenido!

Este es el proyecto final del curso **Diseño y Construcción de Interfaces**. Un sistema completo de gestión de nómina con panel de administración y portal de empleados.

---

## 📁 Estructura del Proyecto

```
proyecto final/
├── 📄 COMIENZA_AQUI.md          ← Estás aquí
├── 00_EMPEZAR_AQUI.txt          ← Instrucciones rápidas
│
├── 📂 docs/                     ← Documentación completa
│   ├── README.md                ← Descripción general
│   ├── INICIO_RAPIDO.md         ← Guía rápida (5 minutos)
│   ├── SETUP.md                 ← Instalación detallada
│   ├── API_REFERENCE.md         ← Referencias de APIs
│   ├── ESQUEMA_BD.md            ← Estructura de base de datos
│   ├── CAMBIOS_REALIZADOS.md    ← Historial de cambios
│   └── ... (10 documentos más)
│
├── 📂 backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── 📂 routes/
│       ├── auth.js
│       ├── charts.js
│       └── employees.js
│
├── 📂 css/
│   ├── styles.css
│   ├── admin.css
│   ├── portal.css
│   ├── login.css
│   ├── login-empleado.css
│   ├── login-admin.css
│   └── recuperar-clave.css
│
├── 📂 js/
│   ├── app.js
│   ├── auth.js
│   ├── admin.js
│   ├── employee.js
│   └── store.js
│
├── 📄 login.html                ← Página de inicio (seleccionar rol)
├── 📄 login-empleado.html       ← Portal de empleado
├── 📄 login-admin.html          ← Panel de administrador
├── 📄 recuperar-clave.html      ← Recuperación de contraseña
├── 📄 admin.html                ← Dashboard de admin
├── 📄 employee.html             ← Perfil de empleado
└── 📄 00_EMPEZAR_AQUI.txt       ← Instrucciones simplificadas

```

---

## ⚡ Inicio Rápido (2 minutos)

### 1. **Instalar dependencias**

```bash
cd backend
npm install
```

### 2. **Configurar base de datos**

- PostgreSQL debe estar corriendo en `localhost:5432`
- Base de datos: `nomina_db`
- Ver `docs/SETUP.md` para detalles

### 3. **Iniciar el servidor**

```bash
npm start
```

El servidor estará disponible en: **http://localhost:3000**

### 4. **Acceder al sistema**

#### 👤 **Como Empleado**

- URL: http://localhost:3000/login-empleado.html
- ID: `1001` | Contraseña: `empleado123`

#### 👨‍💼 **Como Administrador**

- URL: http://localhost:3000/login-admin.html
- ID: `2002` | Contraseña: `adminpassword`

---

## 📚 Documentación Disponible

| Documento                 | Contenido                             |
| ------------------------- | ------------------------------------- |
| **README.md**             | Descripción general del proyecto      |
| **INICIO_RAPIDO.md**      | Guía de 5 minutos                     |
| **SETUP.md**              | Instalación y configuración detallada |
| **API_REFERENCE.md**      | Documentación de endpoints REST       |
| **ESQUEMA_BD.md**         | Estructura de tablas y relaciones     |
| **CAMBIOS_REALIZADOS.md** | Historial completo de cambios         |
| **RESUMEN_EJECUTIVO.md**  | Resumen del proyecto                  |
| **GUIA_TESTING.md**       | Cómo hacer pruebas                    |

👉 **Accede a la carpeta `docs/` para leer cualquier documento**

---

## 🎯 Características Principales

✅ **Autenticación segura** con bcrypt  
✅ **Dos portales separados** (Empleado y Admin)  
✅ **Modo claro/oscuro** con persistencia en localStorage  
✅ **Gráficos interactivos** con Chart.js  
✅ **Panel de administración** con gestión de empleados  
✅ **Portal de empleados** con perfil e ingresos  
✅ **API REST** completa  
✅ **Base de datos PostgreSQL** con 4 empleados demo

---

## 🛠️ Tecnologías Usadas

- **Backend:** Node.js + Express.js
- **Base de Datos:** PostgreSQL 18.1
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **Gráficos:** Chart.js 3.9.1
- **Seguridad:** bcrypt, dotenv
- **Versionamiento:** Git

---

## 🚨 Solución de Problemas

### Puerto 3000 en uso

```bash
# Detener proceso en puerto 3000
netstat -ano | findstr ":3000"
taskkill /PID <PID> /F
```

### Base de datos no conecta

- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `.env`
- Ver `docs/SETUP.md` para más detalles

### Estilos no cargan

- Limpiar caché del navegador (Ctrl + Shift + Delete)
- Verificar que la carpeta `css/` existe

---

## 👤 Usuarios Demo

| Rol                  | ID     | Contraseña      | Acceso                                                           |
| -------------------- | ------ | --------------- | ---------------------------------------------------------------- |
| 👤 Empleado (Juan)   | `1001` | `empleado123`   | [login-empleado.html](http://localhost:3000/login-empleado.html) |
| 👤 Empleado (Carlos) | `1003` | `empleado123`   | [login-empleado.html](http://localhost:3000/login-empleado.html) |
| 👤 Empleado (Luisa)  | `1004` | `empleado123`   | [login-empleado.html](http://localhost:3000/login-empleado.html) |
| 👨‍💼 Administrador     | `2002` | `adminpassword` | [login-admin.html](http://localhost:3000/login-admin.html)       |

---

## 📞 Contacto y Soporte

Para más información, consulta la documentación en la carpeta `docs/`

**Última actualización:** 23 de diciembre de 2025

---

**¡Happy Coding! 🎉**
