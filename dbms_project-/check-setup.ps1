#!/usr/bin/env powershell
# Quick Setup Check Script

Write-Host ""
Write-Host "=== DBMS PROJECT SETUP CHECK ===" -ForegroundColor Cyan
Write-Host ""

$pass = 0
$fail = 0

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $node = node --version
    Write-Host "✓ Node.js: $node" -ForegroundColor Green
    $pass++
} catch {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
    $fail++
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npm = npm --version
    Write-Host "✓ npm: v$npm" -ForegroundColor Green
    $pass++
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
    $fail++
}

# Check backend folder
Write-Host "Checking backend folder..." -ForegroundColor Yellow
if (Test-Path "backend") {
    Write-Host "✓ Backend folder exists" -ForegroundColor Green
    $pass++
} else {
    Write-Host "✗ Backend folder missing" -ForegroundColor Red
    $fail++
}

# Check backend dependencies
Write-Host "Checking backend dependencies..." -ForegroundColor Yellow
if (Test-Path "backend\node_modules") {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
    $pass++
} else {
    Write-Host "⚠ Backend dependencies NOT installed" -ForegroundColor Yellow
    Write-Host "  Run: cd backend; npm install" -ForegroundColor Gray
}

# Check frontend folder
Write-Host "Checking frontend folder..." -ForegroundColor Yellow
if (Test-Path "frontend\admin-dashboard") {
    Write-Host "✓ Frontend folder exists" -ForegroundColor Green
    $pass++
} else {
    Write-Host "✗ Frontend folder missing" -ForegroundColor Red
    $fail++
}

# Check frontend dependencies
Write-Host "Checking frontend dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend\admin-dashboard\node_modules") {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
    $pass++
} else {
    Write-Host "⚠ Frontend dependencies NOT installed" -ForegroundColor Yellow
    Write-Host "  Run: cd frontend\admin-dashboard; npm install" -ForegroundColor Gray
}

# Check .env
Write-Host "Checking backend configuration..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    Write-Host "✓ Backend .env file found" -ForegroundColor Green
    $pass++
} else {
    Write-Host "⚠ Backend .env NOT found" -ForegroundColor Yellow
    Write-Host "  Run: cp backend\.env.example backend\.env" -ForegroundColor Gray
}

# Check database files
Write-Host "Checking database files..." -ForegroundColor Yellow
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
    Write-Host "✓ All database files present" -ForegroundColor Green
    $pass++
} else {
    Write-Host "✗ Missing database files" -ForegroundColor Red
    $fail++
}

# Summary
Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Passed: $pass" -ForegroundColor Green
Write-Host "Failed: $fail" -ForegroundColor Red
Write-Host ""

if ($fail -eq 0) {
    Write-Host "✓ Setup looks good!" -ForegroundColor Green
} else {
    Write-Host "✗ Please fix errors above" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== NEXT STEPS ===" -ForegroundColor Cyan
Write-Host "1. If needed, install dependencies:"
Write-Host "   cd backend; npm install" -ForegroundColor Gray
Write-Host "   cd ../frontend/admin-dashboard; npm install" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start backend (Terminal 1):"
Write-Host "   cd backend; npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start frontend (Terminal 2):"
Write-Host "   cd frontend/admin-dashboard; npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Open in browser:"
Write-Host "   http://localhost:3001" -ForegroundColor Gray
Write-Host ""
