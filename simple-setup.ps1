# Simple TON Project Setup
Write-Host "TON Jetton Wallet - Simple Setup" -ForegroundColor Cyan

# Удаляем проблемные старые файлы
Write-Host "Cleaning old files..." -ForegroundColor Yellow
if (Test-Path "contracts\main.ts") { Remove-Item "contracts\main.ts" -Force }
if (Test-Path "test") { Remove-Item "test" -Recurse -Force }

# Переходим в рабочую директорию
Write-Host "Entering token-contract directory..." -ForegroundColor Yellow
Set-Location "token-contract"

# Очищаем node_modules и переустанавливаем
Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item "node_modules" -Recurse -Force }
if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" -Force }

# Устанавливаем зависимости
npm install --legacy-peer-deps

# Проверяем тесты
Write-Host "Running tests..." -ForegroundColor Cyan
npx mocha lottery-test.ts --require ts-node/register

# Проверяем .env
Write-Host "Checking .env configuration..." -ForegroundColor Cyan
$envContent = Get-Content "../.env" -Raw
if ($envContent -match "UQCcGsNjHAoznOnu2ZFHdSZtsjDosYrLLOhhoZWwyKkzumQ_") {
    Write-Host "Commission address configured" -ForegroundColor Green
} else {
    Write-Host "Commission address NOT configured" -ForegroundColor Red
}

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Add your mnemonic to .env" -ForegroundColor Gray
Write-Host "2. Run: npm run build" -ForegroundColor Gray
Write-Host "3. Run: npm run deploy" -ForegroundColor Gray 