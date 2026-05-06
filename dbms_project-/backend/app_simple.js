// ============================================================================
// STAGE 4: NODE.JS BACKEND - SIMPLIFIED WORKING VERSION
// Government Scheme Eligibility & Enrollment System
// ============================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import Oracle Query Service
const OracleQueryService = require('./src/services/oracleQueryService_enhanced');
const oracleService = new OracleQueryService();

// Import User Authentication Service
const UserAuthService = require('./src/services/userAuthService');
const userAuthService = new UserAuthService();

const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// Body parsing
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// USER AUTHENTICATION ENDPOINTS
// ============================================================================

// User registration
app.post('/api/v1/beneficiary/register', async (req, res) => {
  try {
    const result = await userAuthService.registerUser(req.body);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// User login
app.post('/api/v1/beneficiary/login', async (req, res) => {
  try {
    const { aadhaarNumber, password } = req.body;
    
    if (!aadhaarNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar number and password are required'
      });
    }
    
    const result = await userAuthService.authenticateUser(aadhaarNumber, password);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update user profile with extracted features
app.post('/api/v1/beneficiary/update-features', async (req, res) => {
  try {
    const { aadhaarNumber, extractedFeatures } = req.body;
    
    if (!aadhaarNumber || !extractedFeatures) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar number and extracted features are required'
      });
    }
    
    const result = await userAuthService.updateUserFeatures(aadhaarNumber, extractedFeatures);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Update features error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Document upload
app.post('/api/v1/documents/upload', async (req, res) => {
  try {
    // For demo purposes, we'll handle file upload from form data
    const { aadhaarNumber, documentType } = req.body;
    
    if (!aadhaarNumber || !documentType) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar number and document type are required'
      });
    }
    
    // Mock file object (in real implementation, use multer for file handling)
    const mockFile = {
      name: 'document.pdf',
      size: 1024000,
      type: 'application/pdf'
    };
    
    const result = await userAuthService.uploadDocument(aadhaarNumber, documentType, mockFile);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user profile
app.get('/api/v1/beneficiary/profile/:aadhaarNumber', async (req, res) => {
  try {
    const { aadhaarNumber } = req.params;
    const user = userAuthService.getUserByAadhaar(aadhaarNumber);
    
    if (user) {
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        success: true,
        data: userWithoutPassword
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user documents
app.get('/api/v1/documents/:aadhaarNumber', async (req, res) => {
  try {
    const { aadhaarNumber } = req.params;
    const documents = userAuthService.getDocumentsByAadhaar(aadhaarNumber);
    
    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// User statistics (admin)
app.get('/api/v1/admin/statistics', async (req, res) => {
  try {
    const statistics = userAuthService.getUserStatistics();
    
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Search users (admin)
app.get('/api/v1/admin/users/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const users = userAuthService.searchUsers(q);
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============================================================================
// ORACLE QUERY ENDPOINTS
// ============================================================================

// Execute SQL query
app.post('/api/v1/oracle/query', async (req, res) => {
  try {
    const { query, bindParams = {} } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }
    
    const result = await oracleService.executeQuery(query, { bindParams });
    
    res.json(result);
  } catch (error) {
    console.error('Oracle query error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Explain query execution plan
app.post('/api/v1/oracle/explain', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }
    
    const result = await oracleService.explainQuery(query);
    
    res.json(result);
  } catch (error) {
    console.error('Oracle explain error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Validate query
app.post('/api/v1/oracle/validate', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }
    
    const validation = oracleService.validateQuery(query);
    
    res.json({
      success: validation.isValid,
      message: validation.isValid ? 'Query syntax is valid' : validation.error
    });
  } catch (error) {
    console.error('Oracle validate error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get connection status
app.get('/api/v1/oracle/status', (req, res) => {
  try {
    const status = oracleService.getConnectionStatus();
    
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Oracle status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get query history
app.get('/api/v1/oracle/history', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const history = oracleService.getQueryHistory(parseInt(limit));
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Oracle history error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'DBMS Government Scheme API',
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'DBMS Government Scheme Eligibility & Enrollment System',
    version: '1.0.0',
    stage: 'STAGE 4: Backend API Layer - Complete with Authentication',
    endpoints: {
      // User Authentication
      userRegister: 'POST /api/v1/beneficiary/register',
      userLogin: 'POST /api/v1/beneficiary/login',
      userProfile: 'GET /api/v1/beneficiary/profile/:aadhaarNumber',
      documentUpload: 'POST /api/v1/documents/upload',
      userDocuments: 'GET /api/v1/documents/:aadhaarNumber',
      // Admin Functions
      adminStatistics: 'GET /api/v1/admin/statistics',
      searchUsers: 'GET /api/v1/admin/users/search?q=query',
      // Oracle Query
      oracleQuery: 'POST /api/v1/oracle/query',
      oracleExplain: 'POST /api/v1/oracle/explain',
      oracleValidate: 'POST /api/v1/oracle/validate',
      oracleStatus: 'GET /api/v1/oracle/status',
      oracleHistory: 'GET /api/v1/oracle/history',
      // System
      health: 'GET /health',
    },
    features: [
      'User Registration & Login',
      'Document Upload & Processing',
      'Oracle Database Integration',
      'Real-time Query Execution',
      'SQL Subquery Support',
      'Admin Dashboard',
      'Data Persistence'
    ]
  });
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize Oracle Query Service
    await oracleService.initialize();
    console.log('✓ Oracle Query Service initialized');

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`\n✓ Server started on port ${PORT}`);
      console.log(`✓ API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`✓ Health Check: http://localhost:${PORT}/health`);
      console.log(`✓ Oracle Query Interface: http://127.0.0.1:5173/oracle-query-interface.html`);
      console.log('\n[STAGE 4] Node.js Backend API Layer Ready!\n');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        await oracleService.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully...');
      server.close(async () => {
        await oracleService.close();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
