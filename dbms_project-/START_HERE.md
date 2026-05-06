# 🎯 GETTING STARTED - START HERE!

**Welcome to the Government Scheme Eligibility & Enrollment System**

This document will get you from zero to running in **15-20 minutes**.

---

## ⚡ QUICK START (Choose One)

### Option A: Automatic (Easiest) ⭐ RECOMMENDED
```powershell
# Windows PowerShell
.\startup.ps1
```
Everything starts automatically. Opens dashboard at http://localhost:3001

### Option B: Follow Checklist (Structured)
```powershell
# Windows PowerShell
# Open and follow: EXECUTION_CHECKLIST.md
```
Step-by-step guidance for each phase.

### Option C: Read Guide First (Learning)
```powershell
# Open the QUICK_START.md file
# Follow the 5-step instructions
```

---

## ✅ WHAT YOU NEED (60 seconds)

- [ ] **Node.js v18+** → Download from https://nodejs.org
- [ ] **Oracle 21c** → Already installed locally
- [ ] **Port 3000 & 3001** → Should be free

**Verify you have everything:**
```powershell
.\verify-setup.ps1
```
All green? ✅ You're ready!

---

## 🚀 RUN IN 3 STEPS (3 minutes)

### Step 1: Backend (Terminal 1)
```powershell
cd backend
npm install
npm run dev
```
Wait for: `✓ Server started on port 3000`

### Step 2: Frontend (Terminal 2)
```powershell
cd frontend/admin-dashboard
npm install
npm start
```
Browser opens automatically or go to: **http://localhost:3001**

### Step 3: Done!
You'll see the admin dashboard with data from your Oracle database.

---

## 📊 WHAT YOU'LL SEE

```
http://localhost:3001
├─ KPI Cards (4 metrics)
├─ Geographic Heatmap (villages)
├─ Analytics Charts
├─ Campaign Tracker
├─ Search & Filter
└─ Export Reports
```

All connected to your Oracle database running locally.

---

## 📚 DOCUMENTATION

| Time | What | Link |
|------|------|------|
| **5 min** | See what's inside | [DASHBOARD_PREVIEW.md](DASHBOARD_PREVIEW.md) |
| **10 min** | Run everything | [QUICK_START.md](QUICK_START.md) |
| **15 min** | Step-by-step | [EXECUTION_CHECKLIST.md](EXECUTION_CHECKLIST.md) |
| **20 min** | Understand it | [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) |
| **30 min** | Full details | [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md) |

---

## 🆘 PROBLEMS?

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Stop other apps or change PORT in `.env` |
| Database won't connect | Run `lsnrctl start` in Oracle directory |
| Dependencies fail | Delete `node_modules`, run `npm install` again |
| No data showing | Verify `.env` has correct DB credentials |
| Help! | Open [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md#troubleshooting) |

---

## 🎯 SUCCESS LOOKS LIKE THIS

✅ Backend terminal shows:
```
✓ Server started on port 3000
✓ Oracle connection pool initialized
✓ Ready to handle requests
```

✅ Frontend terminal shows:
```
Compiled successfully!
Local: http://localhost:3001
```

✅ Browser shows:
- Dashboard page loads
- KPI cards display numbers
- Charts show data
- No red errors in F12 console

---

## 📖 FULL DOCUMENTATION

All guides in one place: **[INDEX.md](INDEX.md)**

Or find what you need:
- **Getting started:** [QUICK_START.md](QUICK_START.md)
- **Step by step:** [EXECUTION_CHECKLIST.md](EXECUTION_CHECKLIST.md)
- **Understand it:** [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **See the dashboard:** [DASHBOARD_PREVIEW.md](DASHBOARD_PREVIEW.md)
- **Deep dive:** [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md)
- **Production:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🎓 WHAT YOU'RE RUNNING

```
Frontend (React)
    ↓
Backend (Node.js + Express)
    ↓
Database (Oracle 21c)
```

**All running locally on your machine.**

---

## ⏱️ TIME ESTIMATES

| Phase | Time | Do This |
|-------|------|---------|
| Verify | 2 min | `.\verify-setup.ps1` |
| Install | 5 min | `npm install` (2 places) |
| Start | 2 min | `npm run dev` + `npm start` |
| Test | 1 min | Open browser, check data |
| **TOTAL** | **10 min** | **You're done!** |

---

## 🚀 NEXT STEPS

### Immediately (Now)
1. ✅ Choose an option above (A, B, or C)
2. ✅ Follow the steps
3. ✅ Open http://localhost:3001

### In 5 minutes
- [ ] Dashboard is loading
- [ ] KPI cards show data
- [ ] No errors in console

### In 15 minutes
- [ ] Backend is running
- [ ] Frontend is running
- [ ] You can test API endpoints

### Next (Tomorrow)
- [ ] Explore the dashboard
- [ ] Test registering a beneficiary
- [ ] Review the architecture
- [ ] Read the API documentation

---

## 💡 QUICK TIPS

**Tip 1:** Keep 3 windows open
- Terminal 1: Backend (running)
- Terminal 2: Frontend (running)
- Browser: Dashboard (viewing)

**Tip 2:** Check the logs
- Backend terminal: Shows API calls
- Browser console (F12): Shows errors
- Database: Check with `SELECT COUNT(*) FROM BENEFICIARY;`

**Tip 3:** Restart if needed
```powershell
# Backend: Ctrl+C then npm run dev
# Frontend: Ctrl+C then npm start
# Browser: F5 to refresh
```

---

## ✨ YOU'RE SET UP FOR:

- ✅ Local development
- ✅ Testing functionality
- ✅ Understanding the system
- ✅ Modifying code
- ✅ Learning the architecture
- ✅ Building features
- ✅ Deploying later (Stage 6)

---

## 🎉 LET'S GO!

Pick your path:

### Fast Track ⚡
Go to [QUICK_START.md](QUICK_START.md)

### Guided Track 📋
Go to [EXECUTION_CHECKLIST.md](EXECUTION_CHECKLIST.md)

### Learning Track 🎓
Go to [DASHBOARD_PREVIEW.md](DASHBOARD_PREVIEW.md) first

### All Resources 📚
Go to [INDEX.md](INDEX.md)

---

**Start now!** Everything is ready. Pick one of the options above and go. 🚀

Questions? Check [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md#troubleshooting) troubleshooting section.
