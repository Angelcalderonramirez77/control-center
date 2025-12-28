@echo off
REM Script para iniciar el servidor del Control Center

cd /d "%~dp0backend"

echo.
echo ========================================
echo  🚀 INICIANDO SERVIDOR DE CONTROL CENTER
echo ========================================
echo.
echo Verificando dependencias...
echo.

REM Verificar si existe node_modules
if not exist "node_modules" (
    echo Instalando dependencias con npm...
    call npm install
    echo.
)

echo ========================================
echo Iniciando servidor en puerto 3000...
echo ========================================
echo.

node server.js

pause
