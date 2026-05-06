// ============================================================================
// STAGE 4: NODE.JS BACKEND - Configuration
// Database Connection Configuration (Oracle 21c)
// ============================================================================

const oracledb = require('oracledb');

const dbConfig = {
  // Oracle Connection Details
  user: process.env.DB_USER || 'scheme_admin',
  password: process.env.DB_PASSWORD || 'Secure@12345',
  connectString: process.env.DB_CONNECTION_STRING || 'oracle-host:1521/XEPDB1',
  
  // Connection Pool Configuration
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
  poolTimeout: 60,
  queueTimeout: 60000,
  
  // Other options
  stmtCacheSize: 40,
  fetchAsString: [ oracledb.CLOB, oracledb.BLOB ],
};

// Enable thick mode (if needed)
async function initializeThickMode() {
  if (!oracledb.thin) {
    try {
      await oracledb.initOracleClient({
        libDir: process.env.ORACLE_LIB_DIR || 'C:\\instantclient_21_12'
      });
    } catch (err) {
      console.error('Error initializing Oracle client:', err);
    }
  }
}

module.exports = {
  dbConfig,
  initializeThickMode,
  oracledb
};
