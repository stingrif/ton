# TON Development Environment Setup
Write-Host "🐳 Setting up TON Development Environment" -ForegroundColor Cyan

# Build Docker image
Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
docker build -t ton-dev .

# Run container
Write-Host "🚀 Starting container..." -ForegroundColor Green
docker run -it --name ton-jetton-dev -v ${PWD}:/workspace ton-dev

Write-Host "✅ Environment ready!" -ForegroundColor Green
Write-Host "Commands inside container:" -ForegroundColor White
Write-Host "  cd /workspace/token-contract" -ForegroundColor Gray
Write-Host "  npm test" -ForegroundColor Gray
Write-Host "  npm run build" -ForegroundColor Gray
Write-Host "  npm run deploy" -ForegroundColor Gray 