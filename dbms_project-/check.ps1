# Quick Setup Check
Write-Host ""
Write-Host "=== DBMS PROJECT SETUP CHECK ===" -ForegroundColor Cyan
Write-Host ""

$pass = 0
$fail = 0

# Check Node.js
try {
    $node = node --version
    Write-Host "OK Node.js: $node" -ForegroundColor Green
    $pass++
} catch {
    Write-Host "ERROR Node.js not found" -ForegroundColor Red
    $fail++
}

# Check npm
try {
    $npm = npm --version
    Write-Host "OK npm: v$npm" -ForegroundColor Green
    $pass++
} catch {
    Write-Host "ERROR npm not found" -ForegroundColor Red
    $fail++
}

# Check backend folder
if (Test-Path "backend") {
    Write-Host "OK Backend folder exists" -ForegroundColor Green
    $pass++
} else {
    Write-Host "ERROR Backend folder missing" -ForegroundColor Red
    $fail++
}

# Check backend dependencies
if (Test-Path "backend\node_modules") {
    Write-Host "OK Backend dependencies installed" -ForegroundColor Green
    $pass++
} else {
    Write-Host "WARN Backend dependencies NOT installed" -ForegroundColor Yellow
}

# Check frontend folder
if (Test-Path "frontend\admin-dashboard") {
    Write-Host "OK Frontend folder exists" -ForegroundColor Green
    $pass++
} else {
    Write-Host "ERROR Frontend folder missing" -ForegroundColor Red
    $fail++
}

# Check frontend dependencies
if (Test-Path "frontend\admin-dashboard\node_modules") {
    Write-Host "OK Frontend dependencies installed" -ForegroundColor Green
    $pass++
} else {
    Write-Host "WARN Frontend dependencies NOT installed" -ForegroundColor Yellow
}

# Check .env
if (Test-Path "backend\.env") {
    Write-Host "OK Backend .env file found" -ForegroundColor Green
    $pass++
} else {
    Write-Host "WARN Backend .env NOT found - will need to create it" -ForegroundColor Yellow
}

# Check database files
$dbFiles = @(
    "database\schema\01_tables.sql",
    "database\schema\02_constraints_indexes.sql",
    "database\schema\03_sample_data.sql",
    "database\plsql\01_procedures_functions.sql",
    "database\plsql\02_triggers.sql"
)

$allDbFilesExist = $true
foreach ($file in $dbFiles) {
    if (!(Test-Path $file)) {
        $allDbFilesExist = $false
        break
    }
}

if ($allDbFilesExist) {
    Write-Host "OK All database files present" -ForegroundColor Green
    $pass++
} else {
    Write-Host "ERROR Missing database files" -ForegroundColor Red
    $fail++
}

# Summary
Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Passed: $pass" -ForegroundColor Green
Write-Host "Failed: $fail" -ForegroundColor Red
Write-Host ""

Write-Host "=== NEXT STEPS ===" -ForegroundColor Cyan
Write-Host "1. Install dependencies (if not done):"
Write-Host "   cd backend"
Write-Host "   npm install"
Write-Host ""
Write-Host "2. Install frontend dependencies:"
Write-Host "   cd ../frontend/admin-dashboard"
Write-Host "   npm install"
Write-Host ""
Write-Host "3. Create backend .env file:"
Write-Host "   copy backend\.env.example backend\.env"
Write-Host "   (Edit with your Oracle credentials)"
Write-Host ""
Write-Host "4. Start backend (in Terminal 1):"
Write-Host "   cd backend"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "5. Start frontend (in Terminal 2):"
Write-Host "   cd frontend/admin-dashboard"
Write-Host "   npm start"
Write-Host ""
Write-Host "6. Open browser:"
Write-Host "   http://localhost:3001"
Write-Host ""
