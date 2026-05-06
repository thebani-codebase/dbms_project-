// ============================================================================
// ORACLE DATABASE CONNECTION HELPER
// ============================================================================

const oracledb = require('oracledb');
const { dbConfig } = require('../../config/database');

let connectionPool = null;

// Initialize connection pool
async function initializeConnectionPool() {
  if (connectionPool) {
    return connectionPool;
  }

  try {
    connectionPool = await oracledb.createPool(dbConfig);
    console.log('Oracle Connection Pool created successfully');
    return connectionPool;
  } catch (error) {
    console.error('Error creating connection pool:', error);
    throw error;
  }
}

// Get connection from pool
async function getOracleConnection() {
  if (!connectionPool) {
    await initializeConnectionPool();
  }

  try {
    const connection = await connectionPool.getConnection();
    return connection;
  } catch (error) {
    console.error('Error getting connection from pool:', error);
    throw error;
  }
}

// Close connection pool
async function closeConnectionPool() {
  if (connectionPool) {
    try {
      await connectionPool.close();
      connectionPool = null;
      console.log('Connection pool closed');
    } catch (error) {
      console.error('Error closing connection pool:', error);
    }
  }
}

module.exports = {
  initializeConnectionPool,
  getOracleConnection,
  closeConnectionPool,
};
