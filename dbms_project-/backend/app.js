// ============================================================================
// STAGE 4: NODE.JS BACKEND - MAIN EXPRESS APP
// Government Scheme Eligibility & Enrollment System
// ============================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { initializeConnectionPool, closeConnectionPool } = require('./src/db/oracleConnection');

// Import routes
const voiceRoutes = require('./src/routes/voice');
const beneficiaryRoutes = require('./src/routes/beneficiary');
const eligibilityRoutes = require('./src/routes/eligibility');
const enrollmentRoutes = require('./src/routes/enrollment');
const analyticsRoutes = require('./src/routes/analytics');

// Import Oracle Query Service
const OracleQueryService = require('./src/services/oracleQueryService_fixed');
const oracleService = new OracleQueryService();

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

// File upload
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  useTempFiles: true,
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// ROUTES
// ============================================================================

// Import route modules
const {
  voice,
  beneficiary,
  eligibility,
  enrollment,
  analytics,
} = require('./src/routes/apiRoutes');

// Mount routes
app.use('/api/v1/voice', voice);
app.use('/api/v1/beneficiary', beneficiary);
app.use('/api/v1/eligibility', eligibility);
app.use('/api/v1/enrollment', enrollment);
app.use('/api/v1/analytics', analytics);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'DBMS Government Scheme API',
  });
});

// Oracle Query endpoints
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'DBMS Government Scheme Eligibility & Enrollment System',
    version: '1.0.0',
    stage: 'STAGE 4: Backend API Layer',
    endpoints: {
      voiceQuery: 'POST /api/v1/voice/query',
      registerBeneficiary: 'POST /api/v1/beneficiary/register',
      checkEligibility: 'POST /api/v1/eligibility',
      enrollScheme: 'POST /api/v1/enrollment/apply',
      gapAnalysis: 'GET /api/v1/analytics/gap-report',
      campaignReport: 'GET /api/v1/analytics/campaign/:id/report',
      oracleQuery: 'POST /api/v1/oracle/query',
      oracleExplain: 'POST /api/v1/oracle/explain',
      oracleValidate: 'POST /api/v1/oracle/validate',
      oracleStatus: 'GET /api/v1/oracle/status',
      oracleHistory: 'GET /api/v1/oracle/history',
      health: 'GET /health',
    },
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
    // Initialize Oracle connection pool
    await initializeConnectionPool();
    console.log('✓ Oracle connection pool initialized');
    
    // Initialize Oracle Query Service
    await oracleService.initialize();
    console.log('✓ Oracle Query Service initialized');

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`\n✓ Server started on port ${PORT}`);
      console.log(`✓ API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`✓ Health Check: http://localhost:${PORT}/health`);
      console.log('\n[STAGE 4] Node.js Backend API Layer Ready!\n');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        await closeConnectionPool();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully...');
      server.close(async () => {
        await closeConnectionPool();
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
