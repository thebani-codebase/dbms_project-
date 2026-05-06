@echo off
REM DBMS Project - Local Startup Script

echo.
echo =====================================
echo DBMS PROJECT - STARTUP
echo =====================================
echo.

REM Define paths
set PROJECT_ROOT=c:\Users\bani2\OneDrive\Desktop\DBMS_Donors_project\dbms_project-
set BACKEND_PATH=%PROJECT_ROOT%\backend
set FRONTEND_PATH=%PROJECT_ROOT%\frontend\admin-dashboard

REM Check if services are running
echo Checking services...
netstat -ano | findstr :3000 >nul
if errorlevel 1 (
    echo Starting Backend on port 3000...
    start "DBMS Backend" cmd /k "cd %BACKEND_PATH% && npm run dev"
    timeout /t 3 /nobreak
) else (
    echo Backend already running on port 3000
)

echo.

netstat -ano | findstr :3001 >nul
if errorlevel 1 (
    echo Starting Frontend on port 3001...
    start "DBMS Frontend" cmd /k "cd %FRONTEND_PATH% && npm start"
    timeout /t 3 /nobreak
) else (
    echo Frontend already running on port 3001
)

echo.
echo =====================================
echo SERVICES STARTING
echo =====================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:3001
echo.
echo Waiting for services to initialize...
timeout /t 5 /nobreak

echo.
echo Opening dashboard in browser...
start http://localhost:3001

echo.
echo Dashboard should open in your browser shortly!
echo.
echo If services don't start, check:
echo   1. .env file in backend folder
echo   2. Oracle database is running
echo   3. Ports 3000 and 3001 are available
echo.
pause
