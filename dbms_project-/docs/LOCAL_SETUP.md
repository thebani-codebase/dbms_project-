# 🚀 LOCAL DEVELOPMENT SETUP GUIDE
## Get Everything Running on Localhost

**Estimated Setup Time:** 30-45 minutes  
**Prerequisites:** Node.js 18+, Oracle 21c, Git

---

## 📋 Quick Start (5 Minutes)

### Windows (PowerShell)
```powershell
# 1. Navigate to project
cd c:\Users\bani2\OneDrive\Desktop\DBMS_Donors_project\dbms_project-

# 2. Run startup script
.\startup.ps1

# 3. Open browser
Start-Process "http://localhost:3001"
```

### macOS/Linux (Bash)
```bash
# 1. Navigate to project
cd ~/DBMS_Donors_project/dbms_project-

# 2. Run startup script
chmod +x startup.sh
./startup.sh

# 3. Open browser
open http://localhost:3001
```

---

## 🔧 Detailed Setup

### STEP 1: Verify Prerequisites

#### 1.1 Check Node.js & npm
```bash
# Windows
node --version        # Should show v18.x or higher
npm --version         # Should show v9.x or higher

# If not installed:
# Download from https://nodejs.org (LTS version)
```

#### 1.2 Check Oracle Connection
```bash
# Windows (in cmd or PowerShell)
sqlplus scheme_admin/Secure@12345@XEPDB1

# If this fails:
# 1. Ensure Oracle 21c is installed
# 2. Check Oracle listener is running
# 3. Verify connection string in .env

# To start Oracle listener (Windows):
lsnrctl start

# To check listener status:
lsnrctl status
```

#### 1.3 Check Git
```bash
git --version
```

---

### STEP 2: Configure Environment Variables

#### 2.1 Backend Configuration
```bash
cd backend
cp .env.example .env
```

#### 2.2 Edit .env File
Open `backend/.env` and configure:

```env
# ========== DATABASE ==========
DB_USER=scheme_admin
DB_PASSWORD=Secure@12345
DB_CONNECTION_STRING=127.0.0.1:1521/XEPDB1

# ========== SERVER ==========
PORT=3000
NODE_ENV=development

# ========== GOOGLE CLOUD APIs ==========
GCP_PROJECT_ID=your-gcp-project-id
GCP_KEY_FILE=/path/to/gcp-key.json

# ========== OPENAI ==========
OPENAI_API_KEY=sk-your-api-key-here

# ========== JWT ==========
JWT_SECRET=your-development-secret-key

# ========== LOGGING ==========
LOG_LEVEL=debug

# ========== CACHE ==========
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_ENABLED=false  # Set to true if Redis running locally
```

**Get API Keys:**
- **OpenAI GPT-4:** https://platform.openai.com/api-keys
- **Google Cloud:** https://console.cloud.google.com/apis/credentials
- **GCP Service Account Key:** Download JSON file

---

### STEP 3: Setup Database

#### 3.1 Connect to Oracle
```bash
# Windows
sqlplus scheme_admin/Secure@12345@XEPDB1

# macOS/Linux
sqlplus scheme_admin/Secure@12345@localhost:1521/XEPDB1
```

#### 3.2 Run Database Schema Scripts
```sql
-- Inside sqlplus
@database/schema/01_tables.sql
@database/schema/02_constraints_indexes.sql
@database/schema/03_sample_data.sql

-- Verify
SELECT COUNT(*) FROM user_tables;  -- Should show 20 tables
SELECT COUNT(*) FROM POLICY_SCHEME;  -- Should show 11 schemes

-- Check sample beneficiary
SELECT * FROM BENEFICIARY WHERE beneficiary_id = 1;

-- Exit
EXIT;
```

#### 3.3 Run PL/SQL Procedures
```sql
sqlplus scheme_admin/Secure@12345@XEPDB1

@database/plsql/01_procedures_functions.sql
@database/plsql/02_triggers.sql

-- Test procedure
BEGIN
  calculate_beneficiary_eligibility(1);
END;
/

-- Verify
SELECT * FROM ELIGIBILITY_MATCH WHERE beneficiary_id = 1;

EXIT;
```

---

### STEP 4: Setup & Start Backend

#### 4.1 Install Dependencies
```bash
cd backend
npm install

# Verify installation
npm list | head -20  # Should show installed packages
```

#### 4.2 Start Backend Server
```bash
# Development mode (with hot-reload via nodemon)
npm run dev

# Or production mode
npm start

# Expected output:
# ✓ Server started on port 3000
# ✓ Oracle connection pool initialized
# ✓ Ready to handle requests
```

#### 4.3 Verify Backend is Running
```bash
# In a new terminal/PowerShell
curl http://localhost:3000/health

# Expected response:
# {"status":"OK","timestamp":"2026-04-24T...","service":"DBMS Government Scheme API"}
```

---

### STEP 5: Setup & Start Admin Dashboard

#### 5.1 Install Dependencies
```bash
cd frontend/admin-dashboard
npm install
```

#### 5.2 Start React Development Server
```bash
# In another terminal/PowerShell window
npm start

# Expected output:
# Compiled successfully!
# You can now view the app in the browser.
# Local:            http://localhost:3001
```

#### 5.3 Open Dashboard in Browser
```bash
# Automatically opens, or manually visit:
http://localhost:3001
```

---

## 🌐 Accessing Your Local Project

### URLs to Access

| Component | URL | Port | Notes |
|-----------|-----|------|-------|
| **Admin Dashboard** | http://localhost:3001 | 3001 | Main web UI |
| **Backend API** | http://localhost:3000 | 3000 | REST endpoints |
| **API Health Check** | http://localhost:3000/health | 3000 | Server status |
| **API Docs** | http://localhost:3000/api/docs | 3000 | Swagger docs (if enabled) |

---

## 🧪 Test the Integration

### Test 1: Verify Backend Connection

```bash
# Check health endpoint
curl http://localhost:3000/health

# Expected:
{
  "status": "OK",
  "timestamp": "2026-04-24T...",
  "service": "DBMS Government Scheme API"
}
```

### Test 2: Register a Beneficiary

```bash
# Windows (PowerShell)
$body = @{
    first_name = "Priya"
    last_name = "Singh"
    date_of_birth = "1965-06-15"
    gender = "F"
    annual_income = 180000
    occupation_id = 1
    location_id = 1
    phone_number = "9876543210"
    email = "priya@example.com"
    aadhaar_number = "123456789012"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/beneficiary/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

Or using curl:
```bash
curl -X POST http://localhost:3000/api/v1/beneficiary/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Priya",
    "last_name": "Singh",
    "date_of_birth": "1965-06-15",
    "gender": "F",
    "annual_income": 180000,
    "occupation_id": 1,
    "location_id": 1,
    "phone_number": "9876543210",
    "email": "priya@example.com",
    "aadhaar_number": "123456789012"
  }'

# Expected response:
{
  "success": true,
  "beneficiaryId": 6,
  "message": "Beneficiary registered successfully"
}
```

### Test 3: Check Eligible Schemes

```bash
curl http://localhost:3000/api/v1/eligibility/schemes \
  -H "X-Beneficiary-ID: 1"

# Expected:
{
  "success": true,
  "schemes": [
    {
      "schemeId": 1,
      "schemeName": "Old Age Pension",
      "eligibilityScore": 95,
      "benefits": [...]
    }
  ]
}
```

### Test 4: Access Admin Dashboard

1. Open **http://localhost:3001** in browser
2. You should see:
   - ✅ KPI Overview (4 cards with metrics)
   - ✅ Geographic Heatmap (color-coded villages)
   - ✅ Scheme Analytics (bar/area charts)
   - ✅ Campaign Tracker (campaign cards)
   - ✅ Beneficiary Search (filter table)
   - ✅ Reports Export (download options)

---

## 🎯 Dashboard Features to Test

### 1. KPI Overview
- Total Beneficiaries: 12,500,000
- Total Enrolled: 4,200,000
- Awareness Rate: 56.2%
- Enrollment Gap: 8,300,000

### 2. Geographic Heatmap
- Click on locations to see details
- Colors indicate awareness levels:
  - 🟢 Green: 75%+ (Good)
  - 🟡 Yellow: 50-75% (Fair)
  - 🟠 Orange: 25-50% (Low)
  - 🔴 Red: <25% (Critical)

### 3. Scheme Analytics
- View enrollment rates per scheme
- Compare eligible vs. enrolled beneficiaries
- See trend lines

### 4. Campaign Tracker
- View active campaigns
- Check ROI metrics
- See budget utilization

### 5. Beneficiary Search
- Filter by location, domain, gap size
- See priority scores
- Export to Excel

---

## 📱 Optional: Setup Mobile App (React Native)

```bash
# Install Expo CLI
npm install -g expo-cli

# Navigate to mobile app
cd frontend/mobile

# Install dependencies
npm install

# Start Expo
npm start

# Choose platform:
# i = iOS Simulator
# a = Android Emulator
# w = Web Browser
```

---

## 🛠️ Troubleshooting

### Problem: "Cannot connect to Oracle database"

**Solution:**
```bash
# 1. Check Oracle is running
lsnrctl status

# 2. Start listener if stopped
lsnrctl start

# 3. Verify connection string in .env
# Should be: 127.0.0.1:1521/XEPDB1

# 4. Test connection
sqlplus scheme_admin/Secure@12345@XEPDB1

# 5. Check port 1521 is accessible
netstat -an | grep 1521
```

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port 3000
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# macOS/Linux
lsof -i :3000

# Kill the process or use different port
# Edit .env and change:
PORT=3001
npm run dev
```

### Problem: "npm: command not found"

**Solution:**
```bash
# Reinstall Node.js from https://nodejs.org
# Restart terminal/PowerShell
# Verify: npm --version
```

### Problem: "React app shows blank page"

**Solution:**
```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Restart development server
npm start

# 4. Check browser console for errors (F12)
```

### Problem: "Voice query fails"

**Solution:**
```bash
# 1. Check Google Cloud API key in .env
echo $OPENAI_API_KEY
echo $GCP_PROJECT_ID

# 2. Verify API keys are valid
# Visit https://platform.openai.com/api-keys

# 3. Check GCP key file path
ls $GCP_KEY_FILE

# 4. Test backend logs
tail -f backend.log
```

### Problem: "Dashboard shows "Loading" forever"

**Solution:**
```bash
# 1. Check backend is running
curl http://localhost:3000/health

# 2. Check CORS is enabled in backend
# Should see in app.js:
app.use(cors());

# 3. Check browser console (F12 > Console tab)
# Look for error messages

# 4. Restart both backend and dashboard
```

---

## 📊 What You'll See

### Backend Console (npm run dev)
```
✓ Server started on port 3000
✓ Oracle connection pool initialized (min: 2, max: 10)
✓ Express server running
```

### Dashboard (http://localhost:3001)
```
Header:
  🏛️ Government Schemes Admin Dashboard
  Real-time Analytics & Monitoring

Cards:
  👥 Total Beneficiaries: 12.5M
  ✓ Total Enrolled: 4.2M
  📢 Awareness Rate: 56.2%
  📊 Enrollment Gap: 8.3M

Charts:
  📈 Scheme Enrollment Analytics (Bar Chart)
  📉 Enrollment Rate (Area Chart)

Map:
  🗺️ Geographic Awareness Heatmap
  ├─ 🟢 Amritsar (78%)
  ├─ 🟡 Ludhiana (45%)
  └─ 🔴 Jalandhar (28%)

Tables:
  📋 Search Beneficiaries
  📊 Campaign ROI Tracker
  📄 Reports Export
```

---

## 🎓 Architecture Overview (Running Locally)

```
USER BROWSER
     ↓
┌─────────────────────────────────────┐
│  React Admin Dashboard (3001)        │  ← You see this
│  ├─ KPI Overview                     │
│  ├─ Geographic Heatmap               │
│  ├─ Scheme Analytics                 │
│  ├─ Campaign Tracker                 │
│  ├─ Beneficiary Search               │
│  └─ Reports Export                   │
└──────────────┬──────────────────────┘
               │ HTTP/REST
               ↓
┌─────────────────────────────────────┐
│  Express.js Backend (3000)           │
│  ├─ Voice API Service                │
│  ├─ Eligibility Service              │
│  ├─ Enrollment Service               │
│  ├─ Analytics Service                │
│  └─ Connection Pooling               │
└──────────────┬──────────────────────┘
               │ SQL
               ↓
┌─────────────────────────────────────┐
│  Oracle 21c Database                 │
│  ├─ 18 Tables                        │
│  ├─ 12 Procedures                    │
│  ├─ 12 Triggers                      │
│  └─ Sample Data (5 beneficiaries)    │
└─────────────────────────────────────┘
```

---

## ✅ Success Checklist

- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] Oracle 21c running and accessible
- [ ] .env file configured with credentials
- [ ] Database schema scripts executed
- [ ] Backend dependencies installed (npm install)
- [ ] Backend server running (npm run dev)
- [ ] Backend health check responding (curl localhost:3000/health)
- [ ] Admin dashboard dependencies installed
- [ ] Dashboard running (npm start)
- [ ] Dashboard accessible (http://localhost:3001)
- [ ] KPI metrics displaying
- [ ] Charts loading data
- [ ] Can register new beneficiary
- [ ] Can search eligible schemes

---

## 🚀 Next Steps

1. **Explore the Dashboard**
   - Test all filter options
   - Generate reports
   - View charts in detail

2. **Test API Endpoints**
   - Register beneficiary
   - Check eligibility
   - Apply for scheme
   - View status

3. **Test Voice Feature** (if APIs configured)
   - Upload audio file
   - See speech-to-text
   - Get scheme recommendations
   - Hear audio response

4. **Monitor Logs**
   - Watch backend logs for requests
   - Check API response times
   - Monitor database queries

5. **Prepare for Production**
   - Review Stage 6 AWS setup
   - Plan deployment
   - Test load scenarios

---

## 📞 Support

**Documentation Files:**
- Setup Guide: [docs/SETUP_GUIDE.md](../docs/SETUP_GUIDE.md)
- API Docs: [docs/API_DOCUMENTATION.md](../docs/API_DOCUMENTATION.md)
- README: [README.md](../README.md)

**Command Reference:**
```bash
# Backend
cd backend
npm run dev          # Start with hot-reload
npm start            # Start production mode
npm test             # Run tests

# Dashboard
cd frontend/admin-dashboard
npm start            # Development server
npm build            # Production build
npm test             # Run tests

# Database
sqlplus scheme_admin/Secure@12345@XEPDB1
```

---

**🎉 You're all set! Enjoy your local development environment!**

*Last Updated: April 2026*  
*Version: 1.0.0*
