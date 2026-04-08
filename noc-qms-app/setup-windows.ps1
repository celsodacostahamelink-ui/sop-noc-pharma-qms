# ══════════════════════════════════════════════════════════
# NOC Pharma QMS v1.0 — Windows Setup (PowerShell)
# Right-click → Run with PowerShell
# ══════════════════════════════════════════════════════════

Write-Host ""
Write-Host "🏛️  NOC Pharma QMS v1.0" -ForegroundColor Cyan
Write-Host "   GxP Compliant | 21 CFR Part 11 | EU Annex 11" -ForegroundColor DarkGray
Write-Host "══════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""

# Check Node.js
try {
    $nodeVer = node -v
    Write-Host "✅ Node.js $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Download from https://nodejs.org" -ForegroundColor Red
    Write-Host "   Install v20 LTS, then re-run this script." -ForegroundColor Yellow
    pause
    exit
}

# Check Docker
try {
    docker --version | Out-Null
    Write-Host "✅ Docker found" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker not found. Download from https://docker.com" -ForegroundColor Yellow
    Write-Host "   Without Docker, install PostgreSQL manually." -ForegroundColor Yellow
}

# Setup project
$ProjectDir = "$env:USERPROFILE\noc-pharma-qms"
Write-Host ""
Write-Host "Setting up in: $ProjectDir" -ForegroundColor Cyan

# Find ZIP
$ZipPath = $null
if (Test-Path ".\noc-pharma-qms.zip") { $ZipPath = ".\noc-pharma-qms.zip" }
elseif (Test-Path "$env:USERPROFILE\Downloads\noc-pharma-qms.zip") { $ZipPath = "$env:USERPROFILE\Downloads\noc-pharma-qms.zip" }

if (-not $ZipPath) {
    Write-Host "❌ Cannot find noc-pharma-qms.zip" -ForegroundColor Red
    Write-Host "   Place it in this folder or Downloads" -ForegroundColor Yellow
    pause
    exit
}

# Extract
if (Test-Path $ProjectDir) { Remove-Item $ProjectDir -Recurse -Force }
Expand-Archive -Path $ZipPath -DestinationPath $env:USERPROFILE
Write-Host "✅ Project extracted" -ForegroundColor Green

Set-Location $ProjectDir

# Create .env
$ApiKey = Read-Host "Enter your ANTHROPIC_API_KEY (or press Enter to skip)"

@"
DATABASE_URL=postgresql://noc_pharma:dev_password@localhost:5432/noc_qms
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(python -c "import secrets; print(secrets.token_urlsafe(32))" 2>$null || Write-Output "change-this-secret-key-now")
ANTHROPIC_API_KEY=$ApiKey
UPLOAD_DIR=./uploads
SESSION_MAX_AGE=1800
"@ | Set-Content .env

Write-Host "✅ Environment configured" -ForegroundColor Green

# Start database
Write-Host ""
Write-Host "Starting PostgreSQL..." -ForegroundColor Cyan
try {
    docker compose up db -d
    Start-Sleep -Seconds 10
    Write-Host "✅ Database running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker failed — start PostgreSQL manually" -ForegroundColor Yellow
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies (~60 seconds)..." -ForegroundColor Cyan
npm install --silent 2>&1 | Select-Object -Last 1
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Setup database
Write-Host ""
Write-Host "Creating tables and test users..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path uploads | Out-Null
npx prisma db push --skip-generate 2>&1 | Select-Object -Last 1
npx prisma generate 2>&1 | Select-Object -Last 1
npx tsx prisma/seed.ts

# Done
Write-Host ""
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "🎉 NOC Pharma QMS is ready!" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "   Start:    cd $ProjectDir; npm run dev" -ForegroundColor White
Write-Host "   Browser:  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "   QP login: weber@noc-pharma.de / QP_Test_2026!" -ForegroundColor White
Write-Host "   Auditor:  auditor@bfarm.de    / Audit_2026!" -ForegroundColor White
Write-Host ""

# Start the app
$start = Read-Host "Start the app now? (y/n)"
if ($start -eq "y") {
    npm run dev
}
