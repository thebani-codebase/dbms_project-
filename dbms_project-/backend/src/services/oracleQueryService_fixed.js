// ============================================================================
// ORACLE QUERY SERVICE - Real-time Oracle Database Query Execution
// Mock Implementation for Demo (Oracle not required)
// ============================================================================

class OracleQueryService {
    constructor() {
        this.connection = null;
        this.isConnected = false;
        this.queryHistory = [];
        this.maxHistorySize = 100;
    }

    // Initialize Oracle connection (Mock for demo)
    async initialize() {
        try {
            // For demo purposes, we'll use mock data
            // In production, this would connect to real Oracle database
            console.log('✅ Oracle Query Service Initialized (Mock Mode)');
            console.log('📊 Using Mock Data for Demo');
            
            this.isConnected = true;
            
            return {
                success: true,
                message: 'Oracle query service initialized (demo mode)',
                database: 'Oracle 21c (Demo)',
                connectionType: 'Mock'
            };
        } catch (error) {
            console.error('❌ Oracle Query Service Error:', error);
            this.isConnected = false;
            
            return {
                success: false,
                message: 'Oracle query service failed',
                database: 'Oracle 21c (Error)',
                connectionType: 'Error',
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

            // Execute with mock data
            const result = await this.executeMockQuery(query, options);
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

    // Execute query with mock data
    async executeMockQuery(query, options) {
        console.log('🔄 Executing Mock Query:', query);
        
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
        } else if (upperQuery.includes('ELIGIBILITY_MATCH')) {
            return this.getMockEligibilityData(upperQuery);
        } else if (upperQuery.includes('SCHEME_PERFORMANCE_METRICS')) {
            return this.getMockPerformanceData(upperQuery);
        } else {
            // Default mock response
            return {
                data: [
                    { MESSAGE: 'Mock query executed successfully', STATUS: 'DEMO', QUERY_TYPE: 'CUSTOM' }
                ],
                rowCount: 1,
                columns: ['MESSAGE', 'STATUS', 'QUERY_TYPE']
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
                DATE_OF_BIRTH: '1956-03-15',
                GENDER: 'M',
                MARITAL_STATUS: 'Married',
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
                DATE_OF_BIRTH: '1960-07-22',
                GENDER: 'F',
                MARITAL_STATUS: 'Widow',
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
                DATE_OF_BIRTH: '1985-11-30',
                GENDER: 'M',
                MARITAL_STATUS: 'Married',
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
                APPLICATION_DATE: '2024-06-01',
                APPROVAL_DATE: '2024-06-15',
                ANNUAL_BENEFIT_AMOUNT: 12000
            },
            {
                ENROLLMENT_ID: 2,
                BENEFICIARY_ID: 2,
                SCHEME_ID: 1,
                ENROLLMENT_STATUS: 'Active',
                APPLICATION_DATE: '2024-07-01',
                APPROVAL_DATE: '2024-07-10',
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

    // Mock eligibility data
    getMockEligibilityData(query) {
        const mockData = [
            {
                MATCH_ID: 1,
                BENEFICIARY_ID: 1,
                SCHEME_ID: 2,
                ELIGIBILITY_SCORE: 95.5,
                IS_ELIGIBLE: 'Y',
                MATCHED_AT: '2024-06-01'
            },
            {
                MATCH_ID: 2,
                BENEFICIARY_ID: 2,
                SCHEME_ID: 1,
                ELIGIBILITY_SCORE: 88.2,
                IS_ELIGIBLE: 'Y',
                MATCHED_AT: '2024-07-01'
            }
        ];

        return {
            data: mockData,
            rowCount: mockData.length,
            columns: Object.keys(mockData[0])
        };
    }

    // Mock performance data
    getMockPerformanceData(query) {
        const mockData = [
            {
                METRIC_ID: 1,
                SCHEME_ID: 1,
                TOTAL_ELIGIBLE: 2500,
                TOTAL_ENROLLED: 1800,
                ENROLLMENT_RATE: 72.0,
                TOTAL_ANNUAL_BENEFIT: 21600000,
                DISBURSED_ANNUAL_BENEFIT: 15500000,
                COVERAGE_PERCENTAGE: 85.0,
                SATISFACTION_SCORE: 4.2,
                REPORTING_QUARTER: '2024-Q3'
            }
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
            // Mock explain plan
            const explainData = [
                {
                    OPERATION: 'SELECT STATEMENT',
                    OBJECT_NAME: 'BENEFICIARY',
                    OPTIONS: 'FULL SCAN',
                    COST: 15,
                    CARDINALITY: 3
                }
            ];
            
            return {
                success: true,
                data: explainData,
                message: 'Query execution plan generated (mock)'
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
            database: 'Oracle 21c (Demo)',
            connectionType: 'Mock',
            poolStatus: 'Active'
        };
    }

    // Close connection
    async close() {
        this.isConnected = false;
        console.log('✅ Oracle query service closed');
    }
}

module.exports = OracleQueryService;
