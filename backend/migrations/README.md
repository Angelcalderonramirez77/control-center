# 🔄 Migraciones de Base de Datos

Esta carpeta contiene todos los archivos SQL de migración y actualización de la base de datos del Sistema Control Center.

## 📋 Orden de Ejecución

### Migración Completa (Recomendado)

Si estás configurando la base de datos desde cero, usa:

```sql
-- Ejecutar en MySQL
source migrations_completas.sql;
```

Este archivo contiene:

- Creación de tablas
- Estructuras iniciales
- Migraciones de cédula
- Funciones y procedimientos

### Migraciones Individuales (Histórico)

Los siguientes archivos representan el historial de migraciones:

1. **Esquema inicial** - Primeras tablas
2. **migrate_v2.sql** - Actualización a versión 2
3. **migrate_to_cedula.sql** / **migration_cedula.sql** - Migración a sistema de cédulas
4. **alter_tables.sql** - Alteraciones de estructura
5. **update-employees-table.sql** - Actualizaciones de tabla empleados
6. **migrate_final.sql** - Migración final consolidada

### Scripts de Utilidad

- **cleanup.sql** - Limpia datos de prueba
- **fix_password.sql** - Corrige contraseñas
- **create_monthly_profits.sql** - Crea vista de ganancias mensuales
- **verify.sql** - Verifica integridad de datos
- **test_db.sql** - Pruebas de base de datos

## ⚙️ Uso Recomendado

### Para Desarrollo

```bash
# 1. Ejecutar migración completa
mysql -u root -p control_center < backend/migrations/migrations_completas.sql

# 2. Cargar datos de prueba (ver carpeta seeds/)
```

### Para Producción

1. Hacer backup de la base de datos actual
2. Ejecutar `migrations_completas.sql`
3. Verificar con `verify.sql`

## 🚨 Importante

- Siempre haz backup antes de ejecutar migraciones
- Las migraciones se ejecutan en orden cronológico
- No ejecutes migraciones múltiples veces sin limpiar primero
- Verifica la estructura después de cada migración

## 📝 Registro de Cambios

- **Diciembre 2025**: Consolidación de migraciones en migrations_completas.sql
- **Diciembre 2025**: Migración a sistema de cédulas dominicanas
- **Diciembre 2025**: Adición de campos de posición y horas de trabajo

## 🔗 Ver También

- [../seeds/README.md](../seeds/README.md) - Datos de prueba
- [../../docs/ESQUEMA_BD.md](../../docs/ESQUEMA_BD.md) - Esquema completo de BD
