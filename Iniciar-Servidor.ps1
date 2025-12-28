# Script para iniciar el servidor Control Center
$backendPath = Join-Path $PSScriptRoot "backend"

Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Control Center - Iniciar Servidor   ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Error: No se encontró la carpeta backend" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Set-Location $backendPath
Write-Host "📁 Ubicación: $(Get-Location)" -ForegroundColor Yellow
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
Write-Host ""

npm start

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error al iniciar el servidor" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
}
