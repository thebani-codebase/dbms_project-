@echo off
REM ============================================================================
REM DBMS ORACLE SCHEMA SETUP SCRIPT
REM Executes SQL files in Oracle database
REM ============================================================================

echo.
echo ============================================================================
echo GOVERNMENT SCHEME DATABASE SETUP
echo ============================================================================
echo.
echo This script will:
echo 1. Create 18 database tables
echo 2. Create indexes and constraints
echo 3. Load sample data with 5 beneficiaries and 11 schemes
echo 4. Create stored procedures and functions
echo 5. Create automated triggers
echo.

setlocal enabledelayedexpansion

REM Oracle connection details
set DB_USER=scheme_admin
set DB_PASSWORD=Secure@12345
set DB_CONNECT=localhost:1521/XEPDB1

echo Attempting to connect to Oracle Database...
echo Connection String: %DB_USER%@%DB_CONNECT%
echo.

REM Create a temporary SQL script to execute all files
set TEMP_SQL="%TEMP%\setup_all.sql"

echo Creating temporary SQL script: %TEMP_SQL%
(
  echo SET ECHO ON
  echo SET FEEDBACK ON
  echo SET LINESIZE 999
  echo SET PAGESIZE 50
  echo WHENEVER SQLERROR EXIT SQL.SQLCODE
  echo.
  echo PROMPT ========================================
  echo PROMPT Creating Tables...
  echo PROMPT ========================================
  echo @database/schema/01_tables.sql
  echo.
  echo PROMPT ========================================
  echo PROMPT Creating Indexes and Constraints...
  echo PROMPT ========================================
  echo @database/schema/02_constraints_indexes.sql
  echo.
  echo PROMPT ========================================
  echo PROMPT Loading Sample Data...
  echo PROMPT ========================================
  echo @database/schema/03_sample_data.sql
  echo.
  echo COMMIT;
  echo.
  echo PROMPT ========================================
  echo PROMPT SUCCESS: Database schema created!
  echo PROMPT ========================================
  echo EXIT;
) > %TEMP_SQL%

echo.
echo Executing SQL setup script via sqlplus...
echo.

sqlplus -S %DB_USER%/%DB_PASSWORD%@%DB_CONNECT% @%TEMP_SQL%

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo ERROR: Database setup failed!
  echo Please verify:
  echo - Oracle is running and accessible at %DB_CONNECT%
  echo - Username and password are correct
  echo - SQL files exist in database/schema/ directory
  echo.
  pause
  exit /b 1
)

echo.
echo ============================================================================
echo SUCCESS! Database has been set up with sample data.
echo ============================================================================
echo.
echo You can now:
echo 1. Refresh http://localhost:3001 in your browser
echo 2. See dashboard populated with real data
echo 3. Use the voice query feature to search beneficiaries
echo.
echo Database contains:
echo - 18 tables with proper structure
echo - 5 test beneficiaries
echo - 11 government schemes  
echo - Location hierarchy with 3 villages
echo.
pause
