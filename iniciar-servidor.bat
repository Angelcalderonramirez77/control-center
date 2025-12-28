@echo off
color 0A
title Control Center - Servidor

cls
echo.
echo ========================================
echo    CONTROL CENTER - INICIAR SERVIDOR
echo ========================================
echo.

REM Cambiar a la carpeta del proyecto
cd /d "%~dp0backend"

REM Iniciar servidor
echo Iniciando servidor en puerto 3000...
echo Abre tu navegador en: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm start
