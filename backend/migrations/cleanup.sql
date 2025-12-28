-- Eliminar registros que no son válidos
DELETE FROM employees
WHERE cedula = '1005';
-- Verificar que tengamos solo los 4 empleados correctos
SELECT cedula,
    name,
    role_id
FROM employees
ORDER BY cedula;