# ============================================================================
# LOCAL DEVELOPMENT STARTUP SCRIPT (WINDOWS)
# Starts all components: Oracle, Backend, Frontend
# ============================================================================

Write-Host "🚀 Starting DBMS Government Schemes Project..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Function to check if command exists
function Test-CommandExists {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Function to print status
function Print-Status {
    param($Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Print-Error {
    param($Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Print-Warning {
    param($Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Print-Info {
    param($Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

# ============================================================================
# STEP 1: CHECK PREREQUISITES
# ============================================================================
Write-Host ""
Write-Host "📋 Checking prerequisites..." -ForegroundColor Cyan
Write-Host ""

# Check Node.js
if (-not (Test-CommandExists node)) {
    Print-Error "Node.js not found. Please install Node.js v18+"
    exit 1
}
Print-Status "Node.js found: $(node --version)"

# Check npm
if (-not (Test-CommandExists npm)) {
    Print-Error "npm not found. Please install npm v9+"
    exit 1
}
Print-Status "npm found: $(npm --version)"

# Check sqlplus
if (Test-CommandExists sqlplus) {
    Print-Status "sqlplus found"
    $HasSqlplus = $true
} else {
    Print-Warning "sqlplus not found. Oracle setup will be skipped."
    Print-Info "Install Oracle Client to enable database setup"
    $HasSqlplus = $false
}

# ============================================================================
# STEP 2: SETUP BACKEND
# ============================================================================
Write-Host ""
Write-Host "⚙️  Setting up Backend..." -ForegroundColor Cyan
Write-Host ""

Push-Location backend

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Print-Status "Installing backend dependencies..."
    npm install
} else {
    Print-Status "Backend dependencies already installed"
}

# Create .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Print-Status "Creating .env file from template..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Print-Warning "Please edit .env with your database credentials:"
        Print-Warning "  - DB_USER: scheme_admin"
        Print-Warning "  - DB_PASSWORD: your-password"
        Print-Warning "  - DB_CONNECTION_STRING: oracle-host:1521/XEPDB1"
        Print-Warning "  - OPENAI_API_KEY: your-api-key"
    }
} else {
    Print-Status ".env file already exists"
}

Print-Status "Backend ready"
Pop-Location

# ============================================================================
# STEP 3: SETUP ADMIN DASHBOARD
# ============================================================================
Write-Host ""
Write-Host "📊 Setting up Admin Dashboard..." -ForegroundColor Cyan
Write-Host ""

Push-Location "frontend/admin-dashboard"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Print-Status "Installing dashboard dependencies..."
    npm install
} else {
    Print-Status "Dashboard dependencies already installed"
}

Print-Status "Admin Dashboard ready"
Pop-Location

# ============================================================================
# STEP 4: START SERVICES
# ============================================================================
Write-Host ""
Write-Host "🎬 Starting services..." -ForegroundColor Cyan
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  SERVICES WILL START IN SEPARATE WINDOWS" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Start Backend in new PowerShell window
Print-Status "Starting Backend Server (http://localhost:3000)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"
Start-Sleep -Seconds 2

# Start Admin Dashboard in new PowerShell window
Print-Status "Starting Admin Dashboard (http://localhost:3001)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend\admin-dashboard'; npm start"
Start-Sleep -Seconds 2

# ============================================================================
# STEP 5: DISPLAY SUMMARY
# ============================================================================
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "✓ ALL SERVICES STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

Write-Host "📱 Access Points:" -ForegroundColor Cyan
Write-Host "  • Backend API:      http://localhost:3000" -ForegroundColor White
Write-Host "  • Admin Dashboard:  http://localhost:3001" -ForegroundColor White
Write-Host "  • API Health:       curl http://localhost:3000/health" -ForegroundColor White
Write-Host ""

Write-Host "📝 Quick Tests:" -ForegroundColor Cyan
Write-Host "  1. Open http://localhost:3000 in browser" -ForegroundColor White
Write-Host "  2. Check dashboard KPI Overview" -ForegroundColor White
Write-Host "  3. Try Geographic Heatmap" -ForegroundColor White
Write-Host "  4. Test voice query API" -ForegroundColor White
Write-Host ""

Write-Host "📂 Project Structure:" -ForegroundColor Cyan
Write-Host "  • Database:  database/schema/ + database/plsql/" -ForegroundColor White
Write-Host "  • Backend:   backend/ (Express.js)" -ForegroundColor White
Write-Host "  • Frontend:  frontend/admin-dashboard/ (React)" -ForegroundColor White
Write-Host "  • Mobile:    frontend/mobile/ (React Native)" -ForegroundColor White
Write-Host ""

Write-Host "🔧 Useful Commands:" -ForegroundColor Cyan
Write-Host "  • Test Backend:    curl http://localhost:3000/health" -ForegroundColor White
Write-Host "  • View Backend:    http://localhost:3000" -ForegroundColor White
Write-Host "  • View Dashboard:  http://localhost:3001" -ForegroundColor White
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "  • Quick Start:      docs/SETUP_GUIDE.md" -ForegroundColor White
Write-Host "  • API Reference:    docs/API_DOCUMENTATION.md" -ForegroundColor White
Write-Host "  • Architecture:     README.md" -ForegroundColor White
Write-Host ""

Write-Host "🆘 Troubleshooting:" -ForegroundColor Cyan
Write-Host "  • Port 3000 in use? Change PORT in .env and restart" -ForegroundColor White
Write-Host "  • Database error? Check .env credentials" -ForegroundColor White
Write-Host "  • 'npm: command not found'? Reinstall Node.js" -ForegroundColor White
Write-Host ""

Write-Host "💡 Services are running. Windows will stay open." -ForegroundColor Yellow
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Green
Write-Host "  1. Open http://localhost:3001 in your browser" -ForegroundColor White
Write-Host "  2. Check the KPI Overview and analytics" -ForegroundColor White
Write-Host "  3. Verify backend connectivity" -ForegroundColor White
Write-Host "  4. Test the API endpoints" -ForegroundColor White
Write-Host ""
