# ============================================================================
# LOCAL DEVELOPMENT VERIFICATION SCRIPT
# Tests all components: Database, Backend, Frontend
# ============================================================================

Write-Host "🧪 DBMS Project Local Setup Verification" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0
$WarningCount = 0
$SuccessCount = 0

function Test-Success {
    param($Test)
    Write-Host "✓ $Test" -ForegroundColor Green
    $global:SuccessCount++
}

function Test-Error {
    param($Test)
    Write-Host "✗ $Test" -ForegroundColor Red
    $global:ErrorCount++
}

function Test-Warning {
    param($Test)
    Write-Host "⚠ $Test" -ForegroundColor Yellow
    $global:WarningCount++
}

function Test-Info {
    param($Info)
    Write-Host "ℹ $Info" -ForegroundColor Cyan
}

# ============================================================================
# TEST 1: Prerequisites
# ============================================================================
Write-Host ""
Write-Host "1️⃣  CHECKING PREREQUISITES" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

# Test Node.js
try {
    $nodeVersion = (node --version).Trim()
    if ($nodeVersion -match "v1[89]") {
        Test-Success "Node.js installed: $nodeVersion"
    } else {
        Test-Warning "Node.js version: $nodeVersion (v18+ recommended)"
    }
} catch {
    Test-Error "Node.js not found (required)"
}

# Test npm
try {
    $npmVersion = (npm --version).Trim()
    Test-Success "npm installed: v$npmVersion"
} catch {
    Test-Error "npm not found (required)"
}

# Test Git
try {
    $gitVersion = (git --version).Trim()
    Test-Success "Git installed: $gitVersion"
} catch {
    Test-Warning "Git not found (optional)"
}

# ============================================================================
# TEST 2: Project Structure
# ============================================================================
Write-Host ""
Write-Host "2️⃣  CHECKING PROJECT STRUCTURE" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

$folders = @(
    "backend",
    "frontend\admin-dashboard",
    "frontend\mobile",
    "database\schema",
    "database\plsql",
    "docs",
    "infrastructure\terraform"
)

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Test-Success "Folder exists: $folder"
    } else {
        Test-Error "Folder missing: $folder"
    }
}

# ============================================================================
# TEST 3: Backend Configuration
# ============================================================================
Write-Host ""
Write-Host "3️⃣  CHECKING BACKEND CONFIGURATION" -ForegroundColor Magenta
Write-Host "===================================" -ForegroundColor Magenta

if (Test-Path "backend\package.json") {
    Test-Success "Backend package.json found"
} else {
    Test-Error "Backend package.json not found"
}

if (Test-Path "backend\.env") {
    Test-Success "Backend .env file found"
    
    # Check for required variables
    $envContent = Get-Content "backend\.env" -Raw
    
    $requiredVars = @("DB_USER", "DB_PASSWORD", "DB_CONNECTION_STRING", "PORT")
    foreach ($var in $requiredVars) {
        if ($envContent -match $var) {
            Test-Success ".env has $var"
        } else {
            Test-Warning ".env missing $var (may need configuration)"
        }
    }
} else {
    Test-Warning "Backend .env not found (copy from .env.example and configure)"
}

# ============================================================================
# TEST 4: Backend Dependencies
# ============================================================================
Write-Host ""
Write-Host "4️⃣  CHECKING BACKEND DEPENDENCIES" -ForegroundColor Magenta
Write-Host "===================================" -ForegroundColor Magenta

if (Test-Path "backend\node_modules") {
    Test-Success "Backend node_modules found (dependencies installed)"
} else {
    Test-Warning "Backend node_modules not found"
    Test-Info "Run: cd backend && npm install"
}

# ============================================================================
# TEST 5: Frontend Configuration
# ============================================================================
Write-Host ""
Write-Host "5️⃣  CHECKING FRONTEND (ADMIN DASHBOARD)" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

if (Test-Path "frontend\admin-dashboard\package.json") {
    Test-Success "Dashboard package.json found"
} else {
    Test-Error "Dashboard package.json not found"
}

# ============================================================================
# TEST 6: Frontend Dependencies
# ============================================================================
Write-Host ""
Write-Host "6️⃣  CHECKING FRONTEND DEPENDENCIES" -ForegroundColor Magenta
Write-Host "===================================" -ForegroundColor Magenta

if (Test-Path "frontend\admin-dashboard\node_modules") {
    Test-Success "Dashboard node_modules found (dependencies installed)"
} else {
    Test-Warning "Dashboard node_modules not found"
    Test-Info "Run: cd frontend/admin-dashboard && npm install"
}

# ============================================================================
# TEST 7: Database Files
# ============================================================================
Write-Host ""
Write-Host "7️⃣  CHECKING DATABASE FILES" -ForegroundColor Magenta
Write-Host "============================" -ForegroundColor Magenta

$dbFiles = @(
    "database\schema\01_tables.sql",
    "database\schema\02_constraints_indexes.sql",
    "database\schema\03_sample_data.sql",
    "database\plsql\01_procedures_functions.sql",
    "database\plsql\02_triggers.sql"
)

foreach ($file in $dbFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        Test-Success "Database file found: $file ($size bytes)"
    } else {
        Test-Error "Database file missing: $file"
    }
}

# ============================================================================
# TEST 8: Connectivity Tests
# ============================================================================
Write-Host ""
Write-Host "8️⃣  CHECKING CONNECTIVITY (OPTIONAL)" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Magenta

# Test localhost:3000 (Backend)
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -TimeoutSec 2 -ErrorAction Stop
    Test-Success "Backend running on http://localhost:3000"
} catch {
    Test-Info "Backend not running yet (run: npm run dev in backend folder)"
}

# Test localhost:3001 (Dashboard)
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 2 -ErrorAction Stop
    Test-Success "Dashboard running on http://localhost:3001"
} catch {
    Test-Info "Dashboard not running yet (run: npm start in frontend/admin-dashboard folder)"
}

# ============================================================================
# TEST 9: Documentation
# ============================================================================
Write-Host ""
Write-Host "9️⃣  CHECKING DOCUMENTATION" -ForegroundColor Magenta
Write-Host "===========================" -ForegroundColor Magenta

$docs = @(
    "README.md",
    "docs\SETUP_GUIDE.md",
    "docs\LOCAL_SETUP.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Test-Success "Documentation found: $doc"
    } else {
        Test-Warning "Documentation missing: $doc"
    }
}

# ============================================================================
# SUMMARY
# ============================================================================
Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "              VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "✓ Passed:   $SuccessCount" -ForegroundColor Green
Write-Host "⚠ Warnings: $WarningCount" -ForegroundColor Yellow
Write-Host "✗ Errors:   $ErrorCount" -ForegroundColor Red
Write-Host ""

if ($ErrorCount -eq 0) {
    Write-Host "🎉 Setup looks good! Ready to run the project." -ForegroundColor Green
} else {
    Write-Host "⚠️  Please fix the errors above before proceeding." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "           NEXT STEPS" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Open your project in VS Code:" -ForegroundColor Green
Write-Host "   code ." -ForegroundColor Gray
Write-Host ""

Write-Host "2. Setup database (if not done):" -ForegroundColor Green
Write-Host "   sqlplus scheme_admin/Secure@12345@XEPDB1" -ForegroundColor Gray
Write-Host "   @database/schema/01_tables.sql" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Install backend dependencies:" -ForegroundColor Green
Write-Host "   cd backend; npm install" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Install dashboard dependencies:" -ForegroundColor Green
Write-Host "   cd frontend/admin-dashboard; npm install" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Run startup script:" -ForegroundColor Green
Write-Host "   .\startup.ps1" -ForegroundColor Gray
Write-Host ""

Write-Host "6. Open in browser:" -ForegroundColor Green
Write-Host "   http://localhost:3001" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 For detailed setup instructions:" -ForegroundColor Cyan
Write-Host "   Read: docs/LOCAL_SETUP.md" -ForegroundColor Gray
Write-Host ""

Write-Host "🆘 If you encounter issues:" -ForegroundColor Cyan
Write-Host "   1. Check docs/LOCAL_SETUP.md troubleshooting section" -ForegroundColor Gray
Write-Host "   2. Verify Oracle is running" -ForegroundColor Gray
Write-Host "   3. Check .env configuration" -ForegroundColor Gray
Write-Host "   4. Run this verification script again" -ForegroundColor Gray
Write-Host ""
