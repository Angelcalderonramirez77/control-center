-- Verificar datos del admin
SELECT cedula,
    name,
    password,
    role_id
FROM employees
WHERE cedula = '402-0047666-7';
-- Ver todos los empleados
SELECT cedula,
    name,
    role_id
FROM employees;