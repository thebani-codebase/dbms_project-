# ✅ EXECUTION CHECKLIST - GET RUNNING NOW

**Estimated Time: 15-20 minutes**

---

## PHASE 1: VERIFY YOUR MACHINE (2 min)

- [ ] **Check Node.js**
  ```powershell
  node --version
  npm --version
  ```
  - Expected: v18+ and v9+
  - If not: Download from https://nodejs.org

- [ ] **Check Oracle Running**
  ```powershell
  lsnrctl status
  ```
  - If stopped: `lsnrctl start`
  - If errors: Ensure Oracle 21c is installed

- [ ] **Check Ports Free**
  ```powershell
  netstat -ano | find "3000"
  netstat -ano | find "3001"
  ```
  - If in use: Close other apps or change PORT in .env

---

## PHASE 2: VERIFY PROJECT (2 min)

- [ ] **Run verification script**
  ```powershell
  .\verify-setup.ps1
  ```
  - Should show: ✓ checks passed
  - Fix any ✗ errors shown

- [ ] **Check all required files exist**
  ```powershell
  ls backend/package.json
  ls frontend/admin-dashboard/package.json
  ls database/schema/01_tables.sql
  ```

---

## PHASE 3: DATABASE (3-5 min)

- [ ] **Check if schema already created**
  ```powershell
  sqlplus scheme_admin/Secure@12345@XEPDB1
  SELECT COUNT(*) FROM BENEFICIARY;
  EXIT;
  ```
  - If error: Schema not created yet
  - If number returned: Schema exists - skip to Phase 4

- [ ] **If schema doesn't exist, create it**
  ```powershell
  sqlplus scheme_admin/Secure@12345@XEPDB1
  @database/schema/01_tables.sql
  @database/schema/02_constraints_indexes.sql
  @database/schema/03_sample_data.sql
  @database/plsql/01_procedures_functions.sql
  @database/plsql/02_triggers.sql
  EXIT;
  ```

---

## PHASE 4: BACKEND SETUP (3 min)

### Window 1: Install & Run Backend

- [ ] **Navigate to backend**
  ```powershell
  cd backend
  ```

- [ ] **Copy environment file**
  ```powershell
  cp .env.example .env
  ```

- [ ] **Edit .env** - Open file and ensure:
  ```
  DB_USER=scheme_admin
  DB_PASSWORD=Secure@12345
  DB_CONNECTION_STRING=127.0.0.1:1521/XEPDB1
  PORT=3000
  ```

- [ ] **Install dependencies**
  ```powershell
  npm install
  ```
  - Wait for completion (1-2 min)

- [ ] **Start backend**
  ```powershell
  npm run dev
  ```
  - **Expected output:**
    ```
    ✓ Server started on port 3000
    ✓ Oracle connection pool initialized
    ✓ Ready to handle requests
    ```
  - **DO NOT CLOSE THIS WINDOW** - Keep running!

- [ ] **Verify backend running** (in another terminal)
  ```powershell
  curl http://localhost:3000/health
  ```
  - Should return: `{"status":"OK",...}`

---

## PHASE 5: FRONTEND SETUP (3 min)

### Window 2: Install & Run Dashboard

- [ ] **Open new PowerShell window**
  ```powershell
  cd frontend/admin-dashboard
  ```

- [ ] **Install dependencies**
  ```powershell
  npm install
  ```
  - Wait for completion (1-2 min)

- [ ] **Start dashboard**
  ```powershell
  npm start
  ```
  - **Expected:**
    ```
    Compiled successfully!
    Local: http://localhost:3001
    ```
  - **DO NOT CLOSE THIS WINDOW** - Keep running!

- [ ] **Browser auto-opens** or manually open:
  ```
  http://localhost:3001
  ```

---

## PHASE 6: VERIFY INTEGRATION (3 min)

- [ ] **Dashboard loads** (http://localhost:3001)
  - Should show React admin interface

- [ ] **See KPI cards**
  ```
  ✓ Total Beneficiaries: 12.5M
  ✓ Total Enrolled: 4.2M
  ✓ Awareness Rate: 56.2%
  ✓ Enrollment Gap: 8.3M
  ```

- [ ] **Geographic Heatmap renders**
  - Should show color-coded locations

- [ ] **Charts display data**
  - Scheme Analytics (bar/area charts)
  - Campaign Tracker with ROI

- [ ] **Check browser console** (F12)
  - No red error messages
  - Network tab shows requests to localhost:3000

---

## PHASE 7: TEST FUNCTIONALITY (2 min)

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
    aadhaar_number = "111111111111"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/beneficiary/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

- [ ] Returns success response with new beneficiary ID

### Test 2: Get Eligible Schemes

```powershell
curl -H "X-Beneficiary-ID: 1" http://localhost:3000/api/v1/eligibility/schemes
```

- [ ] Returns array of eligible schemes

### Test 3: Dashboard Loads Data

```powershell
# Refresh dashboard in browser
# F12 > Network tab > look for XHR requests
# Should see: /api/v1/analytics/...
```

- [ ] Requests to backend complete
- [ ] Data displays in dashboard

---

## FINAL VERIFICATION

- [ ] Backend terminal shows:
  - `✓ Server started on port 3000`
  - `✓ Oracle connection pool initialized`

- [ ] Dashboard terminal shows:
  - `Compiled successfully!`
  - `Local: http://localhost:3001`

- [ ] Browser shows:
  - **http://localhost:3001**
  - KPI cards with data
  - Interactive charts
  - Geographic heatmap

- [ ] No error messages in:
  - Backend terminal
  - Dashboard terminal
  - Browser console (F12)

---

## 🎉 SUCCESS INDICATORS

When everything is working:

```
✓ You can access http://localhost:3001 in browser
✓ Dashboard displays 4 KPI cards with numbers
✓ Heatmap shows color-coded locations
✓ Charts render with sample data
✓ Backend terminal shows successful API calls
✓ No errors in browser console (F12)
✓ Can register new beneficiary via API
✓ All components communicate successfully
```

---

## 📊 WHAT YOU NOW HAVE RUNNING

| Component | Status | Access | Purpose |
|-----------|--------|--------|---------|
| React Admin Dashboard | ✅ Running | http://localhost:3001 | View analytics |
| Express Backend | ✅ Running | http://localhost:3000 | API endpoints |
| Oracle Database | ✅ Connected | scheme_admin | Store data |
| Connection Pool | ✅ Ready | 2-10 connections | Database access |
| Sample Data | ✅ Loaded | BENEFICIARY table | Test data |

---

## 🆘 IF SOMETHING FAILS

### Backend won't start
```powershell
# Check database connection
sqlplus scheme_admin/Secure@12345@XEPDB1
# If fails: Check DB credentials in .env

# Check for errors in terminal
# Look for: "Error connecting to database"
# Solution: Verify connection string
```

### Dashboard won't load
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall
rm -Force -Recurse node_modules
npm install

# Restart
npm start
```

### Port already in use
```powershell
# Find what's using port
netstat -ano | find "3000"

# Kill it or change port
# Edit .env: PORT=3001
npm run dev
```

### No data showing
```powershell
# Check backend is running
curl http://localhost:3000/health

# Check browser console for errors (F12)
# Likely cause: API call failing
# Solution: Restart backend
```

---

## 📚 KEEP THESE WINDOWS OPEN

**Window 1: Backend**
```
npm run dev
[Running on :3000]
[DO NOT CLOSE]
```

**Window 2: Dashboard**
```
npm start
[Running on :3001]
[DO NOT CLOSE]
```

**Window 3: Browser**
```
http://localhost:3001
[Dashboard visible]
```

---

## 📖 NEXT READINGS

1. **Quick overview**: [QUICK_START.md](QUICK_START.md)
2. **Detailed setup**: [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md)
3. **How it works**: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
4. **API Reference**: [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---

## ✨ YOU'RE DONE!

Everything is now:
- ✅ Running locally
- ✅ Frontend integrated with backend
- ✅ Backend connected to Oracle
- ✅ Ready to explore

**Access: http://localhost:3001**

**Time to celebrate!** 🎉

---

**Stuck?** Check troubleshooting in [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md)
