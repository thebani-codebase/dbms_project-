// ============================================================================
// INTEGRATION CONFIGURATION - YOGNA SATHI + DBMS DONORS BACKEND
// ============================================================================

// API Configuration
const API_CONFIG = {
  // DBMS Donors Backend API
  DBMS_API_URL: "http://127.0.0.1:3000/api/v1",
  
  // Legacy Yogna Sathi API (fallback)
  LEGACY_API_URL: "http://127.0.0.1:5174",
  
  // Current active API (switch between DBMS and Legacy)
  ACTIVE_API: "DBMS", // "DBMS" or "LEGACY"
  
  // Authentication
  AUTH: {
    ENABLED: true,
    JWT_STORAGE: "ys_jwt_token",
    USER_STORAGE: "ys_user"
  }
};

// API Endpoint Mapping
const ENDPOINTS = {
  // Scheme Management
  SCHEMES: {
    GET_ALL: "/eligibility/schemes",
    CREATE: "/schemes",
    DELETE: "/schemes",
    UPDATE: "/schemes"
  },
  
  // Beneficiary Management
  BENEFICIARY: {
    REGISTER: "/beneficiary/register",
    GET: "/beneficiary",
    UPDATE: "/beneficiary",
    ELIGIBILITY: "/eligibility"
  },
  
  // Enrollment
  ENROLLMENT: {
    APPLY: "/enrollment/apply",
    STATUS: "/enrollment/status",
    HISTORY: "/enrollment/history"
  },
  
  // Voice Query (DBMS Donors Feature)
  VOICE: {
    QUERY: "/voice/query",
    AUDIO_UPLOAD: "/voice/audio-upload",
    SUPPORTED_LANGUAGES: "/voice/supported-languages"
  },
  
  // Analytics
  ANALYTICS: {
    GAP_REPORT: "/analytics/gap-report",
    SCHEME_METRICS: "/analytics/scheme",
    CAMPAIGN_REPORT: "/analytics/campaign",
    COVERAGE_ANALYSIS: "/analytics/coverage"
  },
  
  // Health Check
  HEALTH: "/health"
};

// Role Mapping (Yogna Sathi → DBMS Donors)
const ROLE_MAPPING = {
  "Citizen": "beneficiary",
  "Government": "government_officer", 
  "NGO": "ngo_worker",
  "Admin": "system_admin"
};

// Data Transformation Functions
const DataTransform = {
  // Transform Yogna Sathi scheme data to DBMS format
  schemeToDBMS: (yognaScheme) => ({
    scheme_code: yognaScheme.code || `SCHEME_${yognaScheme.id}`,
    scheme_name: yognaScheme.name,
    domain_name: yognaScheme.domain,
    description: yognaScheme.description || `${yognaScheme.name} - ${yognaScheme.domain} scheme`,
    min_annual_benefit: yognaScheme.benefitAmount || 0,
    max_annual_benefit: yognaScheme.benefitAmount || 0,
    application_method: "Online",
    status: "Active"
  }),
  
  // Transform DBMS scheme data to Yogna Sathi format
  schemeFromDBMS: (dbmsScheme) => ({
    id: dbmsScheme.scheme_id,
    name: dbmsScheme.scheme_name,
    domain: dbmsScheme.domain_name,
    benefit: dbmsScheme.max_annual_benefit ? `Rs ${dbmsScheme.max_annual_benefit}/year` : "Variable",
    minAge: dbmsScheme.min_age || 0,
    maxAge: dbmsScheme.max_age || 120,
    gender: dbmsScheme.gender || "Any",
    incomeMax: dbmsScheme.max_income,
    bpl: dbmsScheme.bpl_required || false,
    tags: [dbmsScheme.domain_name.toLowerCase()],
    steps: dbmsScheme.documents || ["Aadhaar", "Bank Account"]
  }),
  
  // Transform beneficiary data
  beneficiaryToDBMS: (yognaBeneficiary) => ({
    aadhaar_number: yognaBeneficiary.aadhaar,
    first_name: yognaBeneficiary.name.split(' ')[0],
    last_name: yognaBeneficiary.name.split(' ').slice(1).join(' '),
    date_of_birth: yognaBeneficiary.dob,
    gender: yognaBeneficiary.gender,
    annual_income: yognaBeneficiary.income,
    occupation_id: yognaBeneficiary.occupationId || 1,
    location_id: yognaBeneficiary.locationId || 1,
    phone_number: yognaBeneficiary.phone,
    email: yognaBeneficiary.email,
    bpl_status: yognaBeneficiary.bpl ? "Y" : "N",
    caste_category: yognaBeneficiary.caste || "General"
  })
};

// API Request Helper Functions
const APIHelper = {
  // Get base URL based on active API
  getBaseUrl: () => {
    return API_CONFIG.ACTIVE_API === "DBMS" 
      ? API_CONFIG.DBMS_API_URL 
      : API_CONFIG.LEGACY_API_URL;
  },
  
  // Make API request with proper headers
  makeRequest: async (endpoint, options = {}) => {
    const baseUrl = APIHelper.getBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add JWT token if available
    const token = localStorage.getItem(API_CONFIG.AUTH.JWT_STORAGE);
    if (token && API_CONFIG.ACTIVE_API === "DBMS") {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      method: options.method || 'GET',
      headers,
      ...options
    };
    
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      throw error;
    }
  },
  
  // GET request
  get: (endpoint, options = {}) => APIHelper.makeRequest(endpoint, { method: 'GET', ...options }),
  
  // POST request
  post: (endpoint, data, options = {}) => APIHelper.makeRequest(endpoint, { 
    method: 'POST', 
    body: data, 
    ...options 
  }),
  
  // PUT request
  put: (endpoint, data, options = {}) => APIHelper.makeRequest(endpoint, { 
    method: 'PUT', 
    body: data, 
    ...options 
  }),
  
  // DELETE request
  delete: (endpoint, options = {}) => APIHelper.makeRequest(endpoint, { method: 'DELETE', ...options })
};

// Integration Status and Health Check
const IntegrationStatus = {
  // Check if DBMS backend is available
  checkDBMSHealth: async () => {
    try {
      const response = await APIHelper.get(ENDPOINTS.HEALTH);
      return {
        available: true,
        service: response.service,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        available: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },
  
  // Check if Legacy API is available
  checkLegacyHealth: async () => {
    try {
      const response = await fetch(`${API_CONFIG.LEGACY_API_URL}/health`);
      const data = await response.json();
      return {
        available: true,
        service: data.service,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        available: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },
  
  // Auto-switch to available API
  autoDetectAPI: async () => {
    const dbmsHealth = await IntegrationStatus.checkDBMSHealth();
    const legacyHealth = await IntegrationStatus.checkLegacyHealth();
    
    if (dbmsHealth.available) {
      API_CONFIG.ACTIVE_API = "DBMS";
      console.log("✅ Using DBMS Donors Backend");
    } else if (legacyHealth.available) {
      API_CONFIG.ACTIVE_API = "LEGACY";
      console.log("⚠️ Using Legacy Yogna Sathi API (DBMS unavailable)");
    } else {
      console.error("❌ No backend APIs available");
      API_CONFIG.ACTIVE_API = "OFFLINE";
    }
    
    return {
      active: API_CONFIG.ACTIVE_API,
      dbms: dbmsHealth,
      legacy: legacyHealth
    };
  }
};

// Export for use in main app.js
window.IntegrationConfig = API_CONFIG;
window.Endpoints = ENDPOINTS;
window.RoleMapping = ROLE_MAPPING;
window.DataTransform = DataTransform;
window.API = APIHelper;
window.IntegrationStatus = IntegrationStatus;

// Auto-detect available API on load
IntegrationStatus.autoDetectAPI();
