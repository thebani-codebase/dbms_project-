# 🗄️ DBMS Donors Project - Complete Oracle Database Integration System

## 🎯 Project Overview
Complete Government Scheme Eligibility & Enrollment System with Oracle Database Integration

## 📁 Project Structure

### **🔧 Backend System (dbms_project-)**
- **Node.js Backend**: Complete REST API server
- **Oracle Database**: 18 tables with complete schema
- **Authentication**: User registration and login system
- **Query Service**: Enhanced Oracle query execution

### **🌐 Frontend System (yogna_sathi_frontend)**
- **Main Portal**: Government scheme assistant
- **Database Management**: CRUD operations interface
- **Oracle Query Interface**: SQL query execution
- **Testing Interfaces**: Database and Oracle testing

## 🚀 Quick Start

### **Step 1: Backend Setup**
```bash
cd dbms_project-/backend
npm install
node app.js
```
**API**: http://localhost:3000/health

### **Step 2: Frontend Setup**
```bash
cd yogna_sathi_frontend
python -m http.server 5173 --bind 127.0.0.1
```
**Main**: http://127.0.0.1:5173

### **Step 3: Testing**
- **Database Test**: http://127.0.0.1:5173/test-database.html
- **Oracle Test**: http://127.0.0.1:5173/test-oracle-integration.html

## 📊 Database Schema

### **Core Tables (18 Total)**
- **BENEFICIARY**: User profiles and demographics
- **POLICY_SCHEME**: Government schemes and benefits
- **BENEFICIARY_ENROLLMENT**: Enrollment records
- **ELIGIBILITY_MATCH**: Eligibility calculations
- **SCHEME_DOMAIN**: Scheme categories
- **LOCATION**: Geographic data
- **DOCUMENT**: User documents
- **AWARENESS_CAMPAIGN**: Campaign management
- **SCHEME_PERFORMANCE_METRICS**: Performance analytics

## 🔗 API Endpoints

### **Authentication**
- `POST /api/v1/beneficiary/register` - User registration
- `POST /api/v1/beneficiary/login` - User login
- `POST /api/v1/documents/upload` - Document upload

### **Oracle Query**
- `POST /api/v1/oracle/query` - Execute SQL queries
- `POST /api/v1/oracle/explain` - Query execution plan
- `GET /api/v1/oracle/status` - Connection status

### **Database Management**
- `GET /api/v1/beneficiaries` - Get all beneficiaries
- `POST /api/v1/beneficiaries` - Add new beneficiary
- `PUT /api/v1/beneficiaries/:id` - Update beneficiary
- `DELETE /api/v1/beneficiaries/:id` - Delete beneficiary

## 🛠️ Key Technologies

### **Backend**
- **Node.js** with Express framework
- **Oracle Database** with enhanced query service
- **Authentication** with JWT tokens
- **File Upload** with multer middleware

### **Frontend**
- **HTML5** with semantic markup
- **CSS3** with modern styling
- **JavaScript ES6+** with async/await
- **Fetch API** for HTTP requests

## 📈 Features

### **🔍 Oracle Query Interface**
- Real-time SQL query execution
- Support for complex subqueries
- Query templates and history
- Export functionality (CSV/JSON)

### **👥 Database Management**
- Complete CRUD operations
- Real-time data synchronization
- Search and filter functionality
- Data export capabilities

### **🔐 Authentication System**
- User registration with validation
- Secure login with password hashing
- Document upload and management
- Session management

## 🧪 Testing

### **Integration Tests**
- Database connectivity testing
- Oracle query execution testing
- API endpoint testing
- Frontend interface testing

### **Performance Tests**
- Query execution time measurement
- API response time testing
- Database load testing
- Frontend performance testing

## 📞 Support & Contact

### **GitHub Repository**
https://github.com/thebani-codebase/dbms_project-

### **Issues & Support**
- Open issues on GitHub for bugs
- Check documentation for setup instructions
- Review test files for usage examples

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎉 Project Status

### ✅ **Completed Features**
- Complete Oracle database integration
- Enhanced query service with all SQL support
- User authentication system
- Professional frontend interfaces
- Real-time data synchronization
- Complete documentation

### 🚀 **Production Ready**
- All features tested and working
- Performance optimized
- Security measures implemented
- Documentation complete

**🎯 Complete Oracle Database Integration System - Ready for Production!**
