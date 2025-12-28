@echo off
REM Script para configurar datos de prueba

echo.
echo ================================================
echo     INSERTAR DATOS DE PRUEBA - Control Center Pro
echo ================================================
echo.

cd /d "%~dp0"

echo Insertando datos de prueba en la base de datos...
echo.

python insert_test_data.py

echo.
echo ================================================
echo     ¡Listo!
echo ================================================
echo.
echo Ahora puedes:
echo 1. Abrir http://localhost:3000/reports.html
echo 2. Seleccionar enero (2025-01) o diciembre (2025-12)
echo 3. Descargar el PDF o Excel
echo 4. Ver la vista previa
echo.
pause
