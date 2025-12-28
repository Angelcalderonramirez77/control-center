# 🛠️ Utilidades Backend

Esta carpeta contiene scripts de utilidad para mantenimiento, pruebas y análisis del sistema.

## 📁 Archivos Disponibles

### 🔐 Gestión de Contraseñas

#### hash-passwords.js

Hashea contraseñas en texto plano a bcrypt.

```bash
node backend/utils/hash-passwords.js
```

#### reset_passwords.js

Resetea contraseñas de todos los usuarios a valores por defecto.

```bash
node backend/utils/reset_passwords.js
```

#### check_passwords.js

Verifica que las contraseñas estén correctamente hasheadas.

```bash
node backend/utils/check_passwords.js
```

#### set_cedula_password.js

Establece contraseña basada en cédula para usuarios.

```bash
node backend/utils/set_cedula_password.js
```

### 📊 Análisis y Reportes

#### monthly_analysis.js

Genera análisis mensual de nómina y estadísticas.

```bash
node backend/utils/monthly_analysis.js
```

#### generate_report.js

Genera reportes personalizados de empleados y nómina.

```bash
node backend/utils/generate_report.js
```

#### check_daily_income.js

Verifica y muestra ingresos diarios por empleado.

```bash
node backend/utils/check_daily_income.js
```

### 🔌 Conexión y Pruebas

#### test-connection.js

Prueba la conexión a la base de datos MySQL.

```bash
node backend/utils/test-connection.js
```

Útil para verificar:

- Conexión a MySQL
- Credenciales correctas
- Base de datos existente

## 🚀 Uso Común

### Verificar Conexión

```bash
cd backend
node utils/test-connection.js
```

### Resetear Sistema de Contraseñas

```bash
cd backend
node utils/reset_passwords.js
node utils/check_passwords.js
```

### Generar Reporte Mensual

```bash
cd backend
node utils/monthly_analysis.js
```

## ⚙️ Configuración

Todos los scripts usan la configuración de [../db.js](../db.js):

- Host: localhost
- Usuario: root
- Base de datos: control_center
- Puerto: 3306

## 📝 Notas

- Ejecutar desde la carpeta `backend/`
- Requieren Node.js instalado
- Algunos modifican la base de datos
- Usar con precaución en producción

## 🔗 Dependencias

Los scripts requieren:

- `mysql2` - Conexión a MySQL
- `bcrypt` - Hash de contraseñas
- `dotenv` - Variables de entorno (opcional)

## 🆘 Troubleshooting

### Error de Conexión

1. Verificar que MySQL esté corriendo
2. Comprobar credenciales en `db.js`
3. Ejecutar `test-connection.js`

### Error de Contraseñas

1. Ejecutar `check_passwords.js`
2. Si hay problemas, ejecutar `reset_passwords.js`
3. Verificar nuevamente

## 🔗 Ver También

- [../db.js](../db.js) - Configuración de base de datos
- [../migrations/](../migrations/) - Migraciones de BD
- [../seeds/](../seeds/) - Datos de prueba
