UPDATE employees
SET password = '$2b$10$.8BF/zO8nPqr9nsTHL5heunYcDpvb/IK9vdq6kf2gnlWiFyRTIZti'
WHERE cedula = '402-0047666-7';
SELECT cedula,
    name,
    password
FROM employees
WHERE cedula = '402-0047666-7';