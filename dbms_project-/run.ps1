# DBMS Project - Complete Startup Script
# This will start both backend and frontend on localhost

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "DBMS PROJECT - LOCAL STARTUP SCRIPT" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Define project root
$projectRoot = "c:\Users\bani2\OneDrive\Desktop\DBMS_Donors_project\dbms_project-"

# Function to wait a bit
function Wait-ForService {
    param([int]$seconds = 3)
    Write-Host "Waiting $seconds seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds $seconds
}

# Check if already running
Write-Host "Checking if services are already running..." -ForegroundColor Yellow

$backendRunning = $false
$frontendRunning = $false

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $backendRunning = $true
        Write-Host "✓ Backend already running on port 3000" -ForegroundColor Green
    }
} catch {
    Write-Host "✓ Backend not running - will start it" -ForegroundColor Yellow
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $frontendRunning = $true
        Write-Host "✓ Frontend already running on port 3001" -ForegroundColor Green
    }
} catch {
    Write-Host "✓ Frontend not running - will start it" -ForegroundColor Yellow
}

Write-Host ""

# Start Backend if not running
if (!$backendRunning) {
    Write-Host "Starting Backend on port 3000..." -ForegroundColor Cyan
    
    # Create a new terminal for backend
    $backendPath = Join-Path $projectRoot "backend"
    
    # Use cmd to start npm dev
    Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/k cd `"$backendPath`" && npm run dev" `
        -WindowStyle Normal `
        -PassThru
    
    Write-Host "✓ Backend starting in new window..." -ForegroundColor Green
    Wait-ForService -seconds 5
} else {
    Write-Host "Backend already running" -ForegroundColor Green
}

Write-Host ""

# Start Frontend if not running
if (!$frontendRunning) {
    Write-Host "Starting Frontend on port 3001..." -ForegroundColor Cyan
    
    # Create a new terminal for frontend
    $frontendPath = Join-Path $projectRoot "frontend\admin-dashboard"
    
    # Use cmd to start npm start
    Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/k cd `"$frontendPath`" && npm start" `
        -WindowStyle Normal `
        -PassThru
    
    Write-Host "✓ Frontend starting in new window..." -ForegroundColor Green
    Wait-ForService -seconds 5
} else {
    Write-Host "Frontend already running" -ForegroundColor Green
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "         SERVICES STARTING" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Backend:  http://localhost:3000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Green
Write-Host ""

Write-Host "Opening dashboard in browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Open browser to frontend
Start-Process "http://localhost:3001"

Write-Host ""
Write-Host "✓ Dashboard opened in browser!" -ForegroundColor Green
Write-Host ""
Write-Host "Services are starting. Please wait for them to fully initialize..." -ForegroundColor Cyan
Write-Host "Both terminal windows will show their status." -ForegroundColor Cyan
Write-Host ""
Write-Host "If you see any errors, check:" -ForegroundColor Yellow
Write-Host "  1. .env file has correct database credentials" -ForegroundColor Gray
Write-Host "  2. Oracle is running and accessible" -ForegroundColor Gray
Write-Host "  3. Ports 3000 and 3001 are available" -ForegroundColor Gray
Write-Host ""
