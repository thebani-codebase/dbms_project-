#!/bin/bash
# ============================================================================
# LOCAL DEVELOPMENT STARTUP SCRIPT
# Starts all components: Oracle, Backend, Frontend
# ============================================================================

set -e

echo "🚀 Starting DBMS Government Schemes Project..."
echo "================================================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# ============================================================================
# STEP 1: CHECK PREREQUISITES
# ============================================================================
echo ""
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js not found. Please install Node.js v18+"
    exit 1
fi
print_status "Node.js found: $(node --version)"

if ! command_exists npm; then
    print_error "npm not found. Please install npm v9+"
    exit 1
fi
print_status "npm found: $(npm --version)"

if ! command_exists sqlplus; then
    print_warning "sqlplus not found. Oracle may not be configured. Skipping database setup."
    SKIP_DB=true
else
    print_status "sqlplus found"
fi

# ============================================================================
# STEP 2: SETUP DATABASE (OPTIONAL)
# ============================================================================
if [ "$SKIP_DB" != "true" ]; then
    echo ""
    echo "🗄️  Setting up Oracle Database..."
    
    # Check if database schema already exists
    if sqlplus scheme_admin/Secure@12345@XEPDB1 @<<EOF 2>/dev/null | grep -q "COUNT(*)"; then
        print_status "Database schema already exists"
    else
        print_warning "Database setup skipped (or already exists)"
    fi
fi

# ============================================================================
# STEP 3: SETUP BACKEND
# ============================================================================
echo ""
echo "⚙️  Setting up Backend..."

cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
else
    print_status "Backend dependencies already installed"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    cp .env.example .env
    print_warning "Please edit .env with your credentials"
fi

print_status "Backend ready"
cd ..

# ============================================================================
# STEP 4: SETUP ADMIN DASHBOARD
# ============================================================================
echo ""
echo "📊 Setting up Admin Dashboard..."

cd frontend/admin-dashboard

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "Installing dashboard dependencies..."
    npm install
else
    print_status "Dashboard dependencies already installed"
fi

print_status "Admin Dashboard ready"
cd ../../..

# ============================================================================
# STEP 5: START SERVICES
# ============================================================================
echo ""
echo "🎬 Starting services..."
echo ""
echo "================================================"
echo "  SERVICES WILL START IN SEPARATE WINDOWS"
echo "================================================"
echo ""

# Windows/PowerShell detection
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    print_status "Windows detected - using PowerShell"
    
    # Start Backend in new PowerShell window
    print_status "Starting Backend (http://localhost:3000)..."
    powershell -NoExit -Command "cd backend; npm run dev" &
    sleep 2
    
    # Start Admin Dashboard in new PowerShell window
    print_status "Starting Admin Dashboard (http://localhost:3000)..."
    powershell -NoExit -Command "cd frontend/admin-dashboard; npm start" &
    sleep 2
else
    print_status "Unix-like system detected"
    
    # Start Backend in background
    print_status "Starting Backend (http://localhost:3000)..."
    cd backend && npm run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    sleep 2
    
    # Start Admin Dashboard in background
    print_status "Starting Admin Dashboard (http://localhost:3001)..."
    cd ../frontend/admin-dashboard && npm start > ../../dashboard.log 2>&1 &
    DASHBOARD_PID=$!
    sleep 2
fi

# ============================================================================
# STEP 6: DISPLAY SUMMARY
# ============================================================================
echo ""
echo "================================================"
echo -e "${GREEN}✓ ALL SERVICES STARTED SUCCESSFULLY!${NC}"
echo "================================================"
echo ""
echo "📱 Access Points:"
echo "  • Backend API:      http://localhost:3000"
echo "  • Admin Dashboard:  http://localhost:3000 (React dev server)"
echo "  • API Health:       curl http://localhost:3000/health"
echo ""
echo "📝 Quick Tests:"
echo "  1. Open http://localhost:3000 in browser"
echo "  2. Check dashboard KPI Overview"
echo "  3. Try Geographic Heatmap"
echo "  4. Test voice query API"
echo ""
echo "📂 Project Structure:"
echo "  • Database:  database/schema/ + database/plsql/"
echo "  • Backend:   backend/ (Express.js on :3000)"
echo "  • Frontend:  frontend/admin-dashboard/ (React on :3001)"
echo "  • Mobile:    frontend/mobile/ (React Native)"
echo ""
echo "🔧 Useful Commands:"
echo "  • View Backend Logs:     tail -f backend.log"
echo "  • View Dashboard Logs:   tail -f dashboard.log"
echo "  • Test API Endpoint:     curl -X POST http://localhost:3000/api/v1/beneficiary/register -H 'Content-Type: application/json' -d '{...}'"
echo ""
echo "📚 Documentation:"
echo "  • Setup Guide:      docs/SETUP_GUIDE.md"
echo "  • API Reference:    docs/API_DOCUMENTATION.md"
echo "  • README:           README.md"
echo ""
echo "🆘 Troubleshooting:"
echo "  • Port 3000 in use? Change PORT=3001 npm run dev"
echo "  • Database error? Check .env credentials"
echo "  • Module not found? Run npm install again"
echo ""
echo "💡 Press Ctrl+C to stop services"
echo ""

# Keep script running if using background processes
if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "cygwin" && "$OSTYPE" != "win32" ]]; then
    wait
fi
