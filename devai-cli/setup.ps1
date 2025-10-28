# DevAI CLI Setup Script for Windows
# This script sets up the development environment on Windows

Write-Host "🤖 DevAI CLI Development Setup" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16+ first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
if (Get-Command yarn -ErrorAction SilentlyContinue) {
    yarn install
} else {
    npm install
}

# Setup environment file
if (-not (Test-Path ".env")) {
    Write-Host "⚙️  Setting up environment file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Please edit .env file and add your OpenAI API key" -ForegroundColor Blue
} else {
    Write-Host "✅ Environment file already exists" -ForegroundColor Green
}

# Build the project
Write-Host "🏗️  Building project..." -ForegroundColor Yellow
npm run build

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
npm test

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your OpenAI API key" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Test: node dist/index.js --help" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green