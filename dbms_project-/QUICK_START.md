# ⚡ QUICK START - 10 MINUTES
## Get Everything Running Locally

---

## 📝 Prerequisites
- ✅ Node.js v18+ installed
- ✅ Oracle 21c running
- ✅ All project files present
- ✅ Port 3000 & 3001 available

---

## 🚀 STEP 1: Verify Setup (2 min)

```powershell
# Windows PowerShell
.\verify-setup.ps1
```

This checks:
- ✓ Node.js & npm
- ✓ Project folders
- ✓ Database files
- ✓ Configuration files

---

## 🔧 STEP 2: Configure Backend (2 min)

```powershell
cd backend
cp .env.example .env
```

Edit `backend\.env`:
```env
DB_USER=scheme_admin
DB_PASSWORD=Secure@12345
DB_CONNECTION_STRING=127.0.0.1:1521/XEPDB1
PORT=3000
```

---

## 💾 STEP 3: Setup Database (Optional - 5 min)

If schema not created yet:

```bash
sqlplus scheme_admin/Secure@12345@XEPDB1

# Run these:
@database/schema/01_tables.sql
@database/schema/02_constraints_indexes.sql
@database/schema/03_sample_data.sql
@database/plsql/01_procedures_functions.sql
@database/plsql/02_triggers.sql

EXIT;
```

---

## 📦 STEP 4: Install Dependencies (3 min)

**Terminal 1 - Backend:**
```powershell
cd backend
npm install
```

**Terminal 2 - Frontend:**
```powershell
cd frontend/admin-dashboard
npm install
```

---

## 🎬 STEP 5: Start Services (2 min)

**Option A: Automatic (Recommended)**
```powershell
.\startup.ps1
```

**Option B: Manual**

Terminal 1 - Start Backend:
```powershell
cd backend
npm run dev
```

Terminal 2 - Start Dashboard:
```powershell
cd frontend/admin-dashboard
npm start
```

---

## ✅ VERIFY EVERYTHING IS RUNNING

### 1. Backend Health Check
```bash
# In PowerShell
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "service": "DBMS Government Scheme API"
}
```

### 2. Open Dashboard
Go to: **http://localhost:3001**

You should see:
- ✓ KPI Overview (4 cards)
- ✓ Geographic Heatmap
- ✓ Scheme Analytics Charts
- ✓ Campaign Tracker
- ✓ Beneficiary Search

---

## 🧪 Test the Integration

### Test 1: Register a Beneficiary
```powershell
$body = @{
    first_name = "Test"
    last_name = "User"
    date_of_birth = "1965-06-15"
    gender = "M"
    annual_income = 250000
    occupation_id = 1
    location_id = 1
    phone_number = "9876543210"
    email = "test@example.com"
    aadhaar_number = "999999999999"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/beneficiary/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Test 2: Get Eligible Schemes
```powershell
curl -H "X-Beneficiary-ID: 1" http://localhost:3000/api/v1/eligibility/schemes
```

You should get back schemes with eligibility scores.

### Test 3: Check Dashboard
Refresh the dashboard and verify data is loading.

---

## 📊 What You're Running

```
┌─────────────────────────────────┐
│  Admin Dashboard (Port 3001)    │  ← OPEN THIS
│  React App with Charts          │     http://localhost:3001
└────────────┬────────────────────┘
             │ HTTP
             ↓
┌─────────────────────────────────┐
│  Backend API (Port 3000)        │  ← Test this
│  Express.js + 15+ Endpoints     │     curl localhost:3000/health
└────────────┬────────────────────┘
             │ SQL
             ↓
┌─────────────────────────────────┐
│  Oracle 21c Database            │  ← Connected to
│  18 Tables + Sample Data        │     scheme_admin user
└─────────────────────────────────┘
```

---

## 🎯 Dashboard Overview

### KPI Cards
- 👥 **Total Beneficiaries**: 12.5M
- ✓ **Total Enrolled**: 4.2M  
- 📢 **Awareness Rate**: 56.2%
- 📊 **Enrollment Gap**: 8.3M

### Features
1. **Geographic Heatmap** 🗺️
   - Color-coded locations
   - Click for details

2. **Analytics Charts** 📈
   - Enrollment rates
   - Scheme comparison

3. **Campaign Tracker** 📋
   - ROI metrics
   - Budget tracking

4. **Search & Filter** 🔍
   - Find beneficiaries
   - Priority scoring

5. **Export Reports** 📄
   - PDF, Excel, CSV

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check .env DB credentials |
| Port 3000 in use | Kill process or change PORT=3001 |
| Can't connect to Oracle | Run `lsnrctl start` |
| Dashboard won't load | Restart `npm start` |
| No data showing | Check backend health: curl localhost:3000/health |

---

## 📚 Full Documentation

- **Detailed Setup**: [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md)
- **API Reference**: [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- **Architecture**: [README.md](README.md)

---

## ✨ Summary

You're now running:
- ✅ **Frontend**: React Admin Dashboard
- ✅ **Backend**: Node.js Express API
- ✅ **Database**: Oracle 21c with sample data
- ✅ **Connected**: All components integrated

**Access:** http://localhost:3001 🎉

---

**Next Steps:**
1. Explore the dashboard
2. Test API endpoints
3. Try registering a beneficiary
4. View analytics and heatmap
5. Generate reports

**Questions?** See [LOCAL_SETUP.md](docs/LOCAL_SETUP.md) for detailed troubleshooting.
