# Guía de Configuración e Instalación

## 1. Instalación de Dependencias del Backend

```bash
cd backend
npm install
```

## 2. Configuración de la Base de Datos PostgreSQL

### Variables de Entorno

El archivo `.env` ya contiene las credenciales. Actualiza según tu configuración:

- DB_USER: usuario de PostgreSQL (por defecto: postgres)
- DB_PASSWORD: contraseña de PostgreSQL
- DB_HOST: host de la BD (por defecto: localhost)
- DB_NAME: nombre de la base de datos (por defecto: nomina_db)
- DB_PORT: puerto de PostgreSQL (por defecto: 5432)

### Crear la Tabla de Ganancias Mensuales

```bash
psql -U postgres -d nomina_db -f create_monthly_profits.sql
```

O ejecuta manualmente en pgAdmin o línea de comandos:

```sql
CREATE TABLE IF NOT EXISTS monthly_profits (
    id SERIAL PRIMARY KEY,
    month VARCHAR(50) NOT NULL,
    profit NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Iniciar el Servidor

```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 4. Acceder a la Aplicación

1. Abre `login.html` en el navegador
2. Las credenciales están en la base de datos PostgreSQL
3. Los gráficos se renderizan automáticamente

## Cambios Realizados

✅ **Seguridad**: Credenciales protegidas con variables de entorno (.env)
✅ **Chart.js**: Agregado CDN de Chart.js a los archivos HTML
✅ **Tipos de Datos**: Corregida conversión de salarios (NUMERIC)
✅ **Manejo de Errores**: Mejorados logs y gestión de excepciones
✅ **Monthly Profits**: Tabla y datos de ejemplo creados
✅ **Validación**: Campos obligatorios validados en rutas POST

## Estructura de Carpetas

```
proyecto final/
├── backend/
│   ├── .env (NUEVO - Variables de entorno)
│   ├── db.js (ACTUALIZADO)
│   ├── server.js
│   ├── package.json (ACTUALIZADO - Agregado dotenv)
│   ├── create_monthly_profits.sql (NUEVO)
│   └── routes/
│       ├── auth.js (ACTUALIZADO)
│       ├── employees.js (ACTUALIZADO)
│       └── charts.js (ACTUALIZADO)
├── js/
│   ├── app.js
│   ├── admin.js
│   ├── employee.js
│   ├── store.js (ACTUALIZADO)
│   └── auth.js
├── css/
│   ├── styles.css
│   ├── admin.css
│   └── portal.css
├── admin.html (ACTUALIZADO - Agregado Chart.js CDN)
├── employee.html (ACTUALIZADO - Agregado Chart.js CDN)
└── login.html
```
