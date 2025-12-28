@echo off
REM ╔══════════════════════════════════════════════════════════════════╗
REM ║   Script para Insertar Datos de Prueba - Control Center Pro      ║
REM ║   Ejecutar este archivo para preparar los reportes             ║
REM ╚══════════════════════════════════════════════════════════════════╝

setlocal enabledelayedexpansion

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                 CONTROL CENTER PRO                              ║
echo ║           INSERTANDO DATOS DE PRUEBA - REPORTES                 ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM Cambiar al directorio backend
cd /d "%~dp0backend"

if not exist "insert_test_data.js" (
    echo.
    echo ❌ ERROR: No se encontró insert_test_data.js
    echo.
    echo Por favor ejecuta este archivo desde la carpeta del proyecto
    pause
    exit /b 1
)

REM Verificar que Node.js está instalado
where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo ❌ ERROR: Node.js no está instalado o no está en PATH
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.
echo 📌 Conectando a la base de datos...
echo.

REM Ejecutar el script
node insert_test_data.js

REM Verificar si tuvo éxito
if errorlevel 1 (
    echo.
    echo ❌ ERROR: Hubo un problema insertando los datos
    echo.
    echo Posibles causas:
    echo  1. PostgreSQL no está corriendo
    echo  2. La base de datos "nomina_db" no existe
    echo  3. Las credenciales son incorrectas
    echo.
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                  ✨ ¡ÉXITO! ✨                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
echo 📊 Los datos de prueba se insertaron correctamente
echo.
echo 🚀 PRÓXIMOS PASOS:
echo.
echo    1. Asegúrate que el servidor está corriendo:
echo       cd backend
echo       npm start
echo.
echo    2. Abre tu navegador en:
echo       http://localhost:3000/reports.html
echo.
echo    3. Prueba cada feature:
echo       ✓ Selecciona mes 2025-01 o 2025-12
echo       ✓ Click en "👁️ Vista Previa" para ver tabla
echo       ✓ Click en "📄 Generar PDF" para descargar
echo       ✓ Click en "📊 Exportar Excel" para exportar
echo       ✓ Prueba otros tabs (Auditoría, Análisis, Retenciones)
echo.
echo 📋 MESES DISPONIBLES:
echo    • 2025-01 (enero) - 6 pagos
echo    • 2025-12 (diciembre) - 6 pagos
echo.
echo 💡 NOTAS:
echo    • Los datos se adaptaron a los empleados existentes
echo    • Se insertaron 12 pagos + 12 retenciones + 4 auditoría
echo    • Puedes agregar más datos manualmente desde el admin
echo.
echo ═════════════════════════════════════════════════════════════════════
echo.

pause
