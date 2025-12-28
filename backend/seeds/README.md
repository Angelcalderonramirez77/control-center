# 🌱 Seeds - Datos de Prueba

Esta carpeta contiene scripts para cargar datos de prueba en la base de datos.

## 📄 Archivos Disponibles

### insert_test_data.sql

Script SQL con datos de prueba completos:

- Administradores
- Empleados de prueba
- Registros de nómina

**Uso:**

```bash
mysql -u root -p control_center < backend/seeds/insert_test_data.sql
```

### insert_test_data.js

Script Node.js para insertar datos de prueba programáticamente.

**Uso:**

```bash
cd backend
node seeds/insert_test_data.js
```

### insert_test_data.py

Script Python alternativo para insertar datos.

**Uso:**

```bash
python backend/seeds/insert_test_data.py
```

### insert_test_data.bat

Script por lotes para Windows que ejecuta el script Node.js.

**Uso:**

```cmd
cd backend
seeds\insert_test_data.bat
```

### insert_data.sql

Datos adicionales de prueba (histórico).

### insert_payment_december.js

Script específico para insertar pagos de diciembre.

## 👥 Usuarios de Prueba Incluidos

Después de ejecutar los scripts, tendrás acceso a:

### Administrador

- **Cédula**: 402-0047666-7 (o 4020047666-7)
- **Contraseña**: adminpassword
- **Rol**: admin
- **Nombre**: Ana García

### Empleados

- **Cédula**: 001-0000001-0
- **Contraseña**: password123
- **Rol**: employee
- **Nombre**: Juan Pérez

## 🚀 Carga Rápida

Para cargar datos de prueba rápidamente:

```bash
# Opción 1: SQL directo
mysql -u root -p control_center < backend/seeds/insert_test_data.sql

# Opción 2: Script Node.js
cd backend && node seeds/insert_test_data.js

# Opción 3: Desde la raíz del proyecto (Windows)
EJECUTAR_DATOS_PRUEBA.bat
```

## ⚠️ Importante

- Los scripts limpian datos existentes antes de insertar
- Solo usar en ambiente de desarrollo/pruebas
- No ejecutar en producción
- Las contraseñas están hasheadas con bcrypt

## 🔄 Actualización de Datos

Si necesitas actualizar los datos de prueba:

1. Edita `insert_test_data.sql`
2. Ejecuta `cleanup.sql` (en migrations/)
3. Vuelve a ejecutar el script de datos

## 📊 Datos Incluidos

Los scripts crean:

- 1 Administrador
- 3-5 Empleados
- Registros de nómina del último mes
- Configuraciones básicas

## 🔗 Ver También

- [../migrations/README.md](../migrations/README.md) - Migraciones de BD
- [../../docs/ESQUEMA_BD.md](../../docs/ESQUEMA_BD.md) - Esquema de BD
