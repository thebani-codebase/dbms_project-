// ============================================================================
// ORACLE QUERY SERVICE - Real-time Oracle Database Query Execution
// Handles SQL query execution, validation, and result formatting
// ============================================================================

const oracledb = require('oracledb');
const { validationResult } = require('express-validator');

class OracleQueryService {
    constructor() {
        this.connection = null;
        this.isConnected = false;
        this.queryHistory = [];
        this.maxHistorySize = 100;
    }

    // Initialize Oracle connection
    async initialize() {
        try {
            // Oracle connection configuration
            const dbConfig = {
                user: process.env.ORACLE_USER || 'system',
                password: process.env.ORACLE_PASSWORD || 'oracle',
                connectString: process.env.ORACLE_CONNECTION_STRING || 'localhost:1521/XE',
                poolMin: 2,
                poolMax: 10,
                poolIncrement: 1,
                poolTimeout: 60
            };

            // Create connection pool
            this.connection = await oracledb.createPool(dbConfig);
            this.isConnected = true;
            
            console.log('✅ Oracle Database Connected Successfully');
            console.log(`📊 Connection Pool: ${dbConfig.connectString}`);
            
            return {
                success: true,
                message: 'Oracle connection established',
                database: 'Oracle 21c',
                connectionType: 'Live'
            };
        } catch (error) {
            console.error('❌ Oracle Connection Error:', error);
            this.isConnected = false;
            
            // Fallback to mock data
            return {
                success: false,
                message: 'Oracle connection failed, using mock data',
                database: 'Oracle 21c (Mock)',
                connectionType: 'Mock',
                error: error.message
            };
        }
    }

    // Execute SQL query
    async executeQuery(query, options = {}) {
        const startTime = Date.now();
        
        try {
            // Validate query
            const validation = this.validateQuery(query);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            let result;
            
            if (this.isConnected) {
                // Execute on real Oracle database
                result = await this.executeRealQuery(query, options);
            } else {
                // Execute with mock data
                result = await this.executeMockQuery(query, options);
            }

            const executionTime = Date.now() - startTime;
            
            // Add to history
            this.addToHistory(query, result.data, executionTime, true);
            
            return {
                success: true,
                data: result.data,
                rowCount: result.rowCount,
                executionTime: executionTime,
                columns: result.columns,
                message: `Query executed successfully - ${result.rowCount} rows returned`
            };
        } catch (error) {
            const executionTime = Date.now() - startTime;
            
            // Add failed query to history
            this.addToHistory(query, null, executionTime, false, error.message);
            
            return {
                success: false,
                message: error.message,
                executionTime: executionTime,
                error: error.message
            };
        }
    }

    // Execute query on real Oracle database
    async executeRealQuery(query, options) {
        let connection;
        
        try {
            // Get connection from pool
            connection = await this.connection.getConnection();
            
            // Execute query
            const result = await connection.execute(
                query,
                options.bindParams || {},
                {
                    outFormat: oracledb.OBJECT,
                    resultSet: false
                }
            );

            // Format results
            const data = result.rows || [];
            const columns = result.metaData ? result.metaData.map(col => col.name) : [];

            return {
                data: data,
                rowCount: data.length,
                columns: columns
            };
        } finally {
            // Release connection back to pool
            if (connection) {
                await connection.close();
            }
        }
    }

    // Execute query with mock data
    async executeMockQuery(query, options) {
        console.log('🔄 Using Mock Oracle Data for query:', query);
        
        // Parse query to determine what data to return
        const upperQuery = query.toUpperCase().trim();
        
        // Mock data for different tables
        if (upperQuery.includes('BENEFICIARY')) {
            return this.getMockBeneficiaryData(upperQuery);
        } else if (upperQuery.includes('POLICY_SCHEME')) {
            return this.getMockSchemeData(upperQuery);
        } else if (upperQuery.includes('BENEFICIARY_ENROLLMENT')) {
            return this.getMockEnrollmentData(upperQuery);
        } else if (upperQuery.includes('SCHEME_DOMAIN')) {
            return this.getMockDomainData(upperQuery);
        } else if (upperQuery.includes('LOCATION')) {
            return this.getMockLocationData(upperQuery);
        } else if (upperQuery.includes('COUNT(*)')) {
            return this.getMockCountData(upperQuery);
        } else {
            // Default mock response
            return {
                data: [
                    { MESSAGE: 'Mock data - Oracle not connected', STATUS: 'DEMO' }
                ],
                rowCount: 1,
                columns: ['MESSAGE', 'STATUS']
            };
        }
    }

    // Mock beneficiary data
    getMockBeneficiaryData(query) {
        const mockData = [
            {
                BENEFICIARY_ID: 1,
                FIRST_NAME: 'Ramesh',
                LAST_NAME: 'Sharma',
                AADHAAR_NUMBER: '123456789012',
                DATE_OF_BIRTH: new Date('1956-03-15'),
                GENDER: 'M',
                ANNUAL_INCOME: 35000,
                OCCUPATION: 'Retired',
                CASTE_CATEGORY: 'General',
                IS_BPL: 'N',
                LOCATION_ID: 1
            },
            {
                BENEFICIARY_ID: 2,
                FIRST_NAME: 'Priya',
                LAST_NAME: 'Singh',
                AADHAAR_NUMBER: '223456789012',
                DATE_OF_BIRTH: new Date('1960-07-22'),
                GENDER: 'F',
                ANNUAL_INCOME: 25000,
                OCCUPATION: 'Homemaker',
                CASTE_CATEGORY: 'SC',
                IS_BPL: 'Y',
                LOCATION_ID: 2
            },
            {
                BENEFICIARY_ID: 3,
                FIRST_NAME: 'Jitendra',
                LAST_NAME: 'Verma',
                AADHAAR_NUMBER: '323456789012',
                DATE_OF_BIRTH: new Date('1985-11-30'),
                GENDER: 'M',
                ANNUAL_INCOME: 120000,
                OCCUPATION: 'Farmer',
                CASTE_CATEGORY: 'OBC',
                IS_BPL: 'N',
                LOCATION_ID: 3
            }
        ];

        // Apply WHERE clause filtering (basic)
        let filteredData = mockData;
        if (query.includes("WHERE")) {
            if (query.includes("ANNUAL_INCOME <")) {
                filteredData = mockData.filter(b => b.ANNUAL_INCOME < 50000);
            }
            if (query.includes("GENDER = 'M'")) {
                filteredData = filteredData.filter(b => b.GENDER === 'M');
            }
            if (query.includes("GENDER = 'F'")) {
                filteredData = filteredData.filter(b => b.GENDER === 'F');
            }
        }

        return {
            data: filteredData,
            rowCount: filteredData.length,
            columns: Object.keys(mockData[0])
        };
    }

    // Mock scheme data
    getMockSchemeData(query) {
        const mockData = [
            {
                SCHEME_ID: 1,
                SCHEME_NAME: 'Ayushman Bharat - Prime Minister Jan Arogya Yojana',
                DOMAIN_ID: 1,
                MIN_ANNUAL_BENEFIT: 0,
                MAX_ANNUAL_BENEFIT: 500000,
                STATUS: 'Active',
                LAUNCH_YEAR: 2018
            },
            {
                SCHEME_ID: 2,
                SCHEME_NAME: 'Indira Gandhi National Old Age Pension Scheme',
                DOMAIN_ID: 3,
                MIN_ANNUAL_BENEFIT: 12000,
                MAX_ANNUAL_BENEFIT: 12000,
                STATUS: 'Active',
                LAUNCH_YEAR: 1995
            },
            {
                SCHEME_ID: 3,
                SCHEME_NAME: 'Pradhan Mantri Kisan Samman Nidhi',
                DOMAIN_ID: 1,
                MIN_ANNUAL_BENEFIT: 6000,
                MAX_ANNUAL_BENEFIT: 6000,
                STATUS: 'Active',
                LAUNCH_YEAR: 2019
            }
        ];

        let filteredData = mockData;
        if (query.includes("WHERE")) {
            if (query.includes("STATUS = 'Active'")) {
                filteredData = mockData.filter(s => s.STATUS === 'Active');
            }
        }

        return {
            data: filteredData,
            rowCount: filteredData.length,
            columns: Object.keys(mockData[0])
        };
    }

    // Mock enrollment data
    getMockEnrollmentData(query) {
        const mockData = [
            {
                ENROLLMENT_ID: 1,
                BENEFICIARY_ID: 1,
                SCHEME_ID: 2,
                ENROLLMENT_STATUS: 'Active',
                APPLICATION_DATE: new Date('2024-06-01'),
                APPROVAL_DATE: new Date('2024-06-15'),
                ANNUAL_BENEFIT_AMOUNT: 12000
            },
            {
                ENROLLMENT_ID: 2,
                BENEFICIARY_ID: 2,
                SCHEME_ID: 1,
                ENROLLMENT_STATUS: 'Active',
                APPLICATION_DATE: new Date('2024-07-01'),
                APPROVAL_DATE: new Date('2024-07-10'),
                ANNUAL_BENEFIT_AMOUNT: 0
            }
        ];

        let filteredData = mockData;
        if (query.includes("WHERE")) {
            if (query.includes("ENROLLMENT_STATUS IN ('Active', 'Enrolled')")) {
                filteredData = mockData.filter(e => ['Active', 'Enrolled'].includes(e.ENROLLMENT_STATUS));
            }
        }

        return {
            data: filteredData,
            rowCount: filteredData.length,
            columns: Object.keys(mockData[0])
        };
    }

    // Mock domain data
    getMockDomainData(query) {
        const mockData = [
            { DOMAIN_ID: 1, DOMAIN_NAME: 'Healthcare' },
            { DOMAIN_ID: 2, DOMAIN_NAME: 'Agriculture' },
            { DOMAIN_ID: 3, DOMAIN_NAME: 'Social Security' },
            { DOMAIN_ID: 4, DOMAIN_NAME: 'Education' },
            { DOMAIN_ID: 5, DOMAIN_NAME: 'Women & Child' },
            { DOMAIN_ID: 6, DOMAIN_NAME: 'Housing' },
            { DOMAIN_ID: 7, DOMAIN_NAME: 'Employment' },
            { DOMAIN_ID: 8, DOMAIN_NAME: 'Disability' }
        ];

        return {
            data: mockData,
            rowCount: mockData.length,
            columns: Object.keys(mockData[0])
        };
    }

    // Mock location data
    getMockLocationData(query) {
        const mockData = [
            { LOCATION_ID: 1, LOCATION_NAME: 'Amritsar', LOCATION_TYPE: 'District', PARENT_LOCATION_ID: 1 },
            { LOCATION_ID: 2, LOCATION_NAME: 'Ludhiana', LOCATION_TYPE: 'District', PARENT_LOCATION_ID: 1 },
            { LOCATION_ID: 3, LOCATION_NAME: 'Jalandhar', LOCATION_TYPE: 'District', PARENT_LOCATION_ID: 1 },
            { LOCATION_ID: 4, LOCATION_NAME: 'Punjab', LOCATION_TYPE: 'State', PARENT_LOCATION_ID: null }
        ];

        return {
            data: mockData,
            rowCount: mockData.length,
            columns: Object.keys(mockData[0])
        };
    }

    // Mock count data
    getMockCountData(query) {
        let count = 0;
        
        if (query.includes('BENEFICIARY')) {
            count = 3;
        } else if (query.includes('POLICY_SCHEME')) {
            count = 3;
        } else if (query.includes('BENEFICIARY_ENROLLMENT')) {
            count = 2;
        }

        return {
            data: [{ COUNT: count }],
            rowCount: 1,
            columns: ['COUNT']
        };
    }

    // Validate SQL query syntax
    validateQuery(query) {
        const trimmedQuery = query.trim();
        
        if (!trimmedQuery) {
            return { isValid: false, error: 'Query cannot be empty' };
        }

        // Basic SQL injection prevention
        const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'EXEC', 'EXECUTE'];
        const upperQuery = trimmedQuery.toUpperCase();
        
        for (const keyword of dangerousKeywords) {
            if (upperQuery.includes(keyword)) {
                return { isValid: false, error: `Dangerous keyword '${keyword}' not allowed` };
            }
        }

        // Basic syntax validation
        if (!upperQuery.includes('SELECT')) {
            return { isValid: false, error: 'Only SELECT queries are allowed' };
        }

        return { isValid: true };
    }

    // Explain query execution plan
    async explainQuery(query) {
        try {
            const explainQuery = `EXPLAIN PLAN FOR ${query}`;
            const result = await this.executeQuery(explainQuery);
            
            return {
                success: true,
                data: result.data,
                message: 'Query execution plan generated'
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to explain query: ${error.message}`
            };
        }
    }

    // Get query history
    getQueryHistory(limit = 10) {
        return this.queryHistory.slice(0, limit);
    }

    // Add query to history
    addToHistory(query, result, executionTime, success, error = null) {
        const historyItem = {
            query: query,
            timestamp: new Date(),
            executionTime: executionTime,
            success: success,
            rowCount: result ? result.length : 0,
            error: error
        };

        this.queryHistory.unshift(historyItem);
        
        // Limit history size
        if (this.queryHistory.length > this.maxHistorySize) {
            this.queryHistory = this.queryHistory.slice(0, this.maxHistorySize);
        }
    }

    // Get connection status
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            database: 'Oracle 21c',
            connectionType: this.isConnected ? 'Live' : 'Mock',
            poolStatus: this.isConnected ? 'Active' : 'Inactive'
        };
    }

    // Close connection
    async close() {
        if (this.connection) {
            try {
                await this.connection.close();
                this.isConnected = false;
                console.log('✅ Oracle connection closed');
            } catch (error) {
                console.error('❌ Error closing Oracle connection:', error);
            }
        }
    }
}

module.exports = OracleQueryService;
