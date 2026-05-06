# SETUP & DEPLOYMENT GUIDE
## Government Scheme Eligibility & Enrollment System

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Testing](#testing)
7. [Deployment to AWS](#deployment-to-aws)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04+ / macOS 11+ / Windows 10+
- **RAM**: 8GB minimum (16GB recommended)
- **Disk**: 50GB free space

### Required Software
```bash
# Node.js (LTS v18+)
node --version  # v18.17.0 or higher

# npm (v9+)
npm --version   # v9.0.0 or higher

# Python 3.8+ (for scripts)
python --version

# Git
git --version

# Docker & Docker Compose (for containerization)
docker --version
docker-compose --version

# Oracle SQL Developer (optional but recommended)
# Download from: https://www.oracle.com/tools/downloads/sqldev-downloads.html

# AWS CLI (for deployment)
aws --version
```

---

## Local Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd dbms_project-
```

### 2. Create Project Structure
```bash
# Already created, but verify:
ls -la database/schema/
ls -la database/plsql/
ls -la backend/
ls -la frontend/
```

### 3. Install Node Dependencies

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
```

#### Mobile App
```bash
cd frontend/mobile
npm install
```

#### Admin Dashboard
```bash
cd frontend/admin-dashboard
npm install
```

---

## Database Setup

### Step 1: Install Oracle 21c

#### On Windows
```powershell
# Download Oracle 21c from:
# https://www.oracle.com/database/technologies/oracle-database-software-downloads.html

# Run installer
.\setup.exe

# During installation:
# - Choose "Single Instance Database"
# - Set admin password
# - Choose "Typical Installation"
# - Finish setup
```

#### On Ubuntu
```bash
# Download RPM
wget https://download.oracle.com/otn-pub/otn_software/db-free/oracle-database-free-21c-1.0-1.el8.x86_64.rpm

# Install dependencies
sudo yum install -y oracle-database-preinstall-21c

# Install Oracle
sudo rpm -ivh oracle-database-free-21c-1.0-1.el8.x86_64.rpm

# Execute root scripts when prompted
sudo /etc/init.d/oracle-ohasd configure
```

### Step 2: Create Database User
```bash
# Connect as SYSDBA
sqlplus / as sysdba

# Create admin user
CREATE USER scheme_admin IDENTIFIED BY "Secure@12345";
GRANT DBA TO scheme_admin;
GRANT UNLIMITED TABLESPACE TO scheme_admin;
COMMIT;
EXIT;

# Test connection
sqlplus scheme_admin/Secure@12345@XEPDB1
```

### Step 3: Run Database Schema Scripts

```bash
# Connect to database
cd database/schema/

sqlplus scheme_admin/Secure@12345@XEPDB1

# Execute schema creation
@01_tables.sql
@02_constraints_indexes.sql
@03_sample_data.sql

# Verify
SELECT COUNT(*) FROM user_tables;
SELECT COUNT(*) FROM POLICY_SCHEME;

# Exit
EXIT;
```

### Step 4: Run PL/SQL Procedures

```bash
cd database/plsql/

sqlplus scheme_admin/Secure@12345@XEPDB1

# Execute procedures and triggers
@01_procedures_functions.sql
@02_triggers.sql

# Test procedure
BEGIN calculate_beneficiary_eligibility(1); END;
/

# Exit
EXIT;
```

---

## Backend Setup

### Step 1: Configure Environment
```bash
cd backend

# Copy template
cp .env.example .env

# Edit with your values
nano .env
```

**Key environment variables:**
```env
# Database
DB_USER=scheme_admin
DB_PASSWORD=Secure@12345
DB_CONNECTION_STRING=oracle-host:1521/XEPDB1

# APIs
OPENAI_API_KEY=sk-your-key
GCP_PROJECT_ID=your-gcp-project
GCP_KEY_FILE=/path/to/gcp-key.json

# Security
JWT_SECRET=your-secret-key
PORT=3000
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Backend Server
```bash
# Development mode (with nodemon)
npm run dev

# Or production mode
npm start

# Output should show:
# ✓ Server started on port 3000
# ✓ Oracle connection pool initialized
```

### Step 4: Verify API
```bash
# In a new terminal
curl http://localhost:3000/health

# Expected response:
# {"status":"OK","timestamp":"2026-04-24T...","service":"DBMS Government Scheme API"}
```

---

## Frontend Setup

### Mobile App (React Native)

```bash
cd frontend/mobile

# Install dependencies
npm install

# Start Expo
npm start

# Choose platform:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Press 'w' for web browser

# Test voice query screen
# - Navigate to VoiceQuery screen
# - Click start recording
# - Say: "I am 65 years old and a widow"
# - Stop recording
# - Wait for response
```

### Admin Dashboard (React)

```bash
cd frontend/admin-dashboard

# Install dependencies
npm install

# Start development server
npm start

# Opens at http://localhost:3000

# Features to test:
# - KPI Overview (top metrics)
# - Scheme Analytics (bar chart)
# - Geographic Heatmap (color-coded locations)
# - Campaign Tracker (ROI metrics)
# - Beneficiary Search (filter & priority)
# - Reports Export (PDF, Excel, CSV)
```

---

## Testing

### Unit Tests
```bash
cd backend
npm test

# Or watch mode
npm test:watch
```

### Integration Tests
```bash
npm run test:integration
```

### API Testing (Postman)
```bash
# Import Postman collection:
# docs/postman-collection.json

# Test endpoints:
POST /api/v1/voice/query
POST /api/v1/beneficiary/register
GET /api/v1/eligibility/schemes
POST /api/v1/enrollment/apply
GET /api/v1/analytics/gap-report
```

### Load Testing (k6)
```bash
# Install k6
curl https://dl.k6.io/install.sh | sudo bash

# Run load tests
k6 run scripts/load-test-voice.js

# Report: Requests, Response Time, Errors
```

---

## Deployment to AWS

### Step 1: Prepare AWS Account

```bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (ap-south-1)
```

### Step 2: Build Docker Image

```bash
# Navigate to backend
cd backend

# Build image
docker build -t government-schemes:latest .

# Tag for ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

docker tag government-schemes:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/government-schemes:latest

# Push to ECR
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/government-schemes:latest
```

### Step 3: Deploy Infrastructure with Terraform

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Review changes
terraform plan

# Apply
terraform apply

# Output includes:
# - RDS endpoint
# - EC2 instance IPs
# - Load balancer DNS
```

### Step 4: Deploy Backend to EC2

```bash
# Connect to EC2
ssh -i key.pem ec2-user@<instance-ip>

# Pull Docker image
docker pull <account-id>.dkr.ecr.ap-south-1.amazonaws.com/government-schemes:latest

# Run container
docker run -d \
  -p 3000:3000 \
  -e DB_CONNECTION_STRING=<rds-endpoint> \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e GCP_KEY_FILE=/app/gcp-key.json \
  <account-id>.dkr.ecr.ap-south-1.amazonaws.com/government-schemes:latest

# Verify
curl http://localhost:3000/health
```

### Step 5: Deploy Frontends to S3 + CloudFront

```bash
# Build React app
cd frontend/admin-dashboard
npm run build

# Upload to S3
aws s3 sync build/ s3://my-schemes-dashboard/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"

# Access via CloudFront URL
```

---

## Monitoring & Maintenance

### CloudWatch Logs
```bash
# View application logs
aws logs tail /aws/lambda/government-schemes --follow

# Get specific error logs
aws logs filter-log-events \
  --log-group-name /aws/lambda/government-schemes \
  --filter-pattern "ERROR"
```

### Database Backup
```bash
# Automated RDS backup
aws rds create-db-snapshot \
  --db-instance-identifier government-schemes-db \
  --db-snapshot-identifier backup-2026-04-24
```

### Performance Metrics
```bash
# CPU usage
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name CPUUtilization \
  --dimensions Name=DBInstanceIdentifier,Value=government-schemes-db \
  --statistics Average \
  --start-time 2026-04-24T00:00:00Z \
  --end-time 2026-04-24T23:59:59Z \
  --period 3600
```

---

## Troubleshooting

### Common Issues

#### 1. Oracle Connection Error
```
Error: ORA-12514: TNS:listener does not currently know of service requested
```
**Solution:**
```bash
# Check listener status
lsnrctl status

# Start listener if not running
lsnrctl start

# Verify connection string in .env
DB_CONNECTION_STRING=oracle-host:1521/XEPDB1
```

#### 2. GPT-4 API Error
```
Error: 401 Unauthorized - Invalid API key
```
**Solution:**
```bash
# Verify API key
echo $OPENAI_API_KEY

# Get new key from: https://platform.openai.com/api-keys

# Update .env
OPENAI_API_KEY=sk-your-new-key
```

#### 3. Google Cloud Speech-to-Text Error
```
Error: Failed to authenticate with Google Cloud
```
**Solution:**
```bash
# Ensure GCP key file is present
ls -la $GCP_KEY_FILE

# Set permissions
chmod 600 $GCP_KEY_FILE

# Verify key file format (should be JSON)
cat $GCP_KEY_FILE | grep "type"  # Should show "type": "service_account"
```

#### 4. Database Migration Error
```
Error: ORA-00604: error occurred at recursive SQL level 1
```
**Solution:**
```bash
# Clear constraints
sqlplus scheme_admin/Secure@12345@XEPDB1
BEGIN
  FOR r IN (SELECT table_name FROM user_tables) LOOP
    EXECUTE IMMEDIATE 'DROP TABLE ' || r.table_name || ' CASCADE CONSTRAINTS';
  END LOOP;
END;
/

# Re-run schema scripts
@01_tables.sql
```

#### 5. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

---

## Performance Optimization

### Database Optimization
```sql
-- Create composite index for voice queries
CREATE INDEX idx_beneficiary_demo ON BENEFICIARY(age, gender, location_id);

-- Analyze table statistics
ANALYZE TABLE BENEFICIARY;

-- Check query execution plan
EXPLAIN PLAN FOR
SELECT ps.scheme_name FROM POLICY_SCHEME ps
WHERE ps.domain_id = 1 AND ps.status = 'Active';
```

### Backend Optimization
```bash
# Enable compression
export COMPRESSION=true

# Increase connection pool
DB_POOL_MAX=50

# Enable caching
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend Optimization
```bash
# Production build
npm run build

# Analyze bundle size
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

---

## Production Checklist

- [ ] Database: Backup configured
- [ ] Backend: SSL/TLS enabled
- [ ] API: Rate limiting active
- [ ] Frontend: Performance optimized
- [ ] Monitoring: CloudWatch configured
- [ ] Logging: Winston logs enabled
- [ ] Security: Firewall rules set
- [ ] Domains: DNS configured
- [ ] Email: SMTP configured for alerts
- [ ] Documentation: Updated

---

## Support

**Email:** support@example.com  
**Slack:** #government-schemes  
**Documentation:** `/docs`

---

**Last Updated:** April 2026  
**Version:** 1.0.0
