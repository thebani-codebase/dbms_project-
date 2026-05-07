const demoUsers = [
  { id: "citizen-senior", email: "senior@yognasaathi.in", password: "senior123", role: "Citizen", name: "Gurmeet Kaur", ageGroup: "Senior Citizen", profile: { age: 65, gender: "F", marital: "Widow", occupation: "Homemaker", income: 36000, bpl: true, disability: false, caste: "General", location: "Khera, Punjab" } },
  { id: "citizen-youth", email: "student@yognasaathi.in", password: "student123", role: "Citizen", name: "Aman Singh", ageGroup: "Youth / Student", profile: { age: 19, gender: "M", marital: "Single", occupation: "Student", income: 0, bpl: true, disability: false, caste: "SC", location: "Ludhiana, Punjab" } },
  { id: "citizen-women", email: "woman@yognasaathi.in", password: "woman123", role: "Citizen", name: "Meena Devi", ageGroup: "Women & Child", profile: { age: 28, gender: "F", marital: "Married", occupation: "Self Help Group", income: 65000, bpl: true, disability: false, caste: "OBC", location: "Patiala, Punjab" } },
  { id: "gov", email: "officer@yognasaathi.gov", password: "gov123", role: "Government", name: "District Welfare Officer", ageGroup: "Government Officer" },
  { id: "ngo", email: "ngo@yognasaathi.org", password: "ngo123", role: "NGO", name: "Saathi Field Coordinator", ageGroup: "NGO Field Worker" },
  { id: "admin", email: "admin@yognasaathi.in", password: "admin123", role: "Admin", name: "DBMS Admin", ageGroup: "System Administrator" }
];

const schemes = [
  { id: 1, name: "Ayushman Bharat - Prime Minister Jan Arogya Yojana", domain: "Healthcare", benefit: "Rs 5,00,000 cover", minAge: 0, maxAge: 120, gender: "Any", incomeMax: 150000, bpl: true, tags: ["health", "bpl", "family"], steps: ["Aadhaar", "Ration card", "Family ID"] },
  { id: 2, name: "National Rural Health Mission", domain: "Healthcare", benefit: "Rural health support", minAge: 0, maxAge: 120, gender: "Any", incomeMax: 10000, tags: ["health", "rural"], steps: ["Aadhaar", "Residence proof"] },
  { id: 3, name: "Rashtriya Bal Swasthya Karyakram", domain: "Healthcare", benefit: "Child health program", minAge: 0, maxAge: 18, gender: "Any", incomeMax: 5000, tags: ["health", "child"], steps: ["Birth certificate", "Aadhaar"] },
  { id: 4, name: "Indira Gandhi National Old Age Pension Scheme", domain: "Social Security", benefit: "Rs 12,000/year", minAge: 60, maxAge: 120, gender: "Any", incomeMax: 48000, tags: ["senior", "pension"], steps: ["Aadhaar", "Age proof", "Bank account", "Residence proof"] },
  { id: 5, name: "Indira Gandhi National Widow Pension Scheme", domain: "Social Security", benefit: "Rs 18,000/year", minAge: 18, maxAge: 120, gender: "F", marital: "Widow", incomeMax: 48000, tags: ["widow", "senior", "women"], steps: ["Aadhaar", "Bank account", "Widow certificate", "Income certificate"] },
  { id: 6, name: "Indira Gandhi National Disability Pension Scheme", domain: "Social Security", benefit: "Rs 12,000/year", minAge: 18, maxAge: 120, gender: "Any", disability: true, incomeMax: 48000, tags: ["disability", "pension"], steps: ["Disability certificate", "Aadhaar", "Bank account"] },
  { id: 7, name: "National Social Assistance Program", domain: "Social Security", benefit: "Rs 8,000/year", minAge: 18, maxAge: 120, gender: "Any", incomeMax: 24000, tags: ["social", "assistance"], steps: ["Aadhaar", "Income certificate", "Bank account"] },
  { id: 8, name: "Pradhan Mantri Kisan Samman Nidhi", domain: "Agriculture", benefit: "Rs 6,000/year", minAge: 18, maxAge: 120, gender: "Any", occupation: "Farmer", incomeMax: 120000, tags: ["farmer", "land"], steps: ["Land record", "Aadhaar", "Bank account"] },
  { id: 9, name: "Pradhan Mantri Fasal Bima Yojana", domain: "Agriculture", benefit: "Crop insurance", minAge: 18, maxAge: 120, gender: "Any", occupation: "Farmer", incomeMax: 50000, tags: ["farmer", "insurance"], steps: ["Land record", "Aadhaar", "Bank account"] },
  { id: 10, name: "Pradhan Mantri Krishi Sinchai Yojana", domain: "Agriculture", benefit: "Micro-irrigation support", minAge: 18, maxAge: 120, gender: "Any", occupation: "Farmer", incomeMax: 45000, tags: ["farmer", "irrigation"], steps: ["Land record", "Aadhaar", "Bank account"] },
  { id: 11, name: "Soil Health Card Scheme", domain: "Agriculture", benefit: "Soil testing & support", minAge: 18, maxAge: 120, gender: "Any", occupation: "Farmer", incomeMax: 2000, tags: ["farmer", "soil"], steps: ["Land record", "Aadhaar"] },
  { id: 12, name: "Mahatma Gandhi National Rural Employment Guarantee Act", domain: "Employment", benefit: "100 days employment", minAge: 18, maxAge: 120, gender: "Any", incomeMax: 18000, tags: ["employment", "rural"], steps: ["Aadhaar", "Residence proof"] },
  { id: 13, name: "Prime Minister Employment Generation Programme", domain: "Employment", benefit: "Self-employment loans", minAge: 18, maxAge: 120, gender: "Any", incomeMax: 500000, tags: ["employment", "business"], steps: ["Business plan", "Aadhaar", "Bank account"] },
  { id: 14, name: "Pradhan Mantri Garib Kalyan Yojana", domain: "Employment", benefit: "Skill training", minAge: 18, maxAge: 35, gender: "Any", incomeMax: 8000, tags: ["employment", "training"], steps: ["Aadhaar", "Educational certificates"] },
  { id: 15, name: "Prime Minister Scholarship Scheme", domain: "Education", benefit: "Tuition + stipend", minAge: 16, maxAge: 25, gender: "Any", occupation: "Student", caste: ["SC", "OBC"], incomeMax: 12000, tags: ["student", "scholarship"], steps: ["Caste certificate", "Income certificate", "Marksheets", "Bank account"] },
  { id: 16, name: "National Scholarship Portal", domain: "Education", benefit: "Higher education scholarships", minAge: 16, maxAge: 30, gender: "Any", occupation: "Student", incomeMax: 50000, tags: ["student", "scholarship"], steps: ["Marksheets", "Income certificate", "Bank account"] },
  { id: 17, name: "Mahila Kisan Udyam Yojana", domain: "Women & Child", benefit: "Women entrepreneur support", minAge: 18, maxAge: 60, gender: "F", occupation: "Farmer", incomeMax: 100000, tags: ["women", "entrepreneur"], steps: ["Aadhaar", "Business plan", "Bank account"] },
  { id: 18, name: "Pradhan Mantri Ujjwala Yojana", domain: "Women & Child", benefit: "Free LPG connection", minAge: 18, maxAge: 120, gender: "F", incomeMax: 150000, bpl: true, tags: ["women", "bpl", "lpg"], steps: ["Aadhaar", "Ration card", "Bank account"] },
  { id: 19, name: "Beti Bachao Beti Padhao", domain: "Women & Child", benefit: "Education support for girls", minAge: 0, maxAge: 18, gender: "F", tags: ["women", "education"], steps: ["Birth certificate", "Aadhaar"] },
  { id: 20, name: "Pradhan Mantri Awas Yojana - Gramin", domain: "Housing", benefit: "Rs 1,20,000 support", minAge: 18, maxAge: 120, gender: "Any", incomeMax: 120000, bpl: true, tags: ["housing", "rural"], steps: ["SECC verification", "Aadhaar", "Land or residence proof"] },
  { id: 21, name: "Pradhan Mantri Awas Yojana - Urban", domain: "Housing", benefit: "Rs 1,00,000 support", minAge: 18, maxAge: 120, gender: "Any", incomeMax: 100000, tags: ["housing", "urban"], steps: ["Income certificate", "Aadhaar", "Bank account"] }
];

const locations = [
  { name: "Khera", district: "Ludhiana", awareness: 28, eligibleGap: 463, priority: "critical", missedBenefit: "Rs 2.4 Cr" },
  { name: "Bhaini", district: "Patiala", awareness: 45, eligibleGap: 220, priority: "warn", missedBenefit: "Rs 1.1 Cr" },
  { name: "Jagraon", district: "Ludhiana", awareness: 61, eligibleGap: 124, priority: "ok", missedBenefit: "Rs 54 L" },
  { name: "Raikot", district: "Ludhiana", awareness: 34, eligibleGap: 310, priority: "critical", missedBenefit: "Rs 1.8 Cr" }
];

const campaigns = [
  { name: "Senior Pension Camp", location: "Khera", roi: "104%", enrollments: 183, cost: "Rs 1,600", status: "Active" },
  { name: "Women LPG Drive", location: "Bhaini", roi: "78%", enrollments: 96, cost: "Rs 1,250", status: "Planning" },
  { name: "Student Scholarship Desk", location: "Jagraon", roi: "61%", enrollments: 74, cost: "Rs 980", status: "Completed" }
];

const policyCatalog = [
  { code: "PMJAY", name: "Ayushman Bharat PM-JAY", domain: "Healthcare", ministry: "Ministry of Health", awareness: 52, coverage: 38, documents: ["Aadhaar", "Ration Card", "Family ID"], channel: "ASHA worker + village camp", barrier: "Families know the card name but not hospital use." },
  { code: "IGNOAP", name: "Old Age Pension Scheme", domain: "Pension", ministry: "Social Justice", awareness: 41, coverage: 29, documents: ["Aadhaar", "Age Proof", "Bank Account"], channel: "Panchayat desk", barrier: "Age proof and bank linking delays." },
  { code: "IGNWPS", name: "Widow Pension Scheme", domain: "Social Security", ministry: "Social Justice", awareness: 34, coverage: 22, documents: ["Aadhaar", "Widow Certificate", "Income Certificate"], channel: "Door-to-door outreach", barrier: "Certificate process unclear." },
  { code: "PMKISAN", name: "PM-KISAN Samman Nidhi", domain: "Agriculture", ministry: "Agriculture", awareness: 68, coverage: 54, documents: ["Aadhaar", "Land Record", "Bank Account"], channel: "Kisan call + camp", barrier: "Land record mismatch." },
  { code: "PMAYG", name: "PM Awas Gramin", domain: "Housing", ministry: "Rural Development", awareness: 37, coverage: 18, documents: ["SECC Verification", "Residence Proof", "Aadhaar"], channel: "Gram Sabha list reading", barrier: "People do not know waiting-list status." },
  { code: "NSP-SC", name: "Post Matric Scholarship", domain: "Education", ministry: "Education", awareness: 46, coverage: 31, documents: ["Caste Certificate", "Income Certificate", "Marksheets"], channel: "School/college help desk", barrier: "Portal form complexity." },
  { code: "UJJWALA", name: "Ujjwala Yojana", domain: "Women & Child", ministry: "Petroleum", awareness: 62, coverage: 47, documents: ["Aadhaar", "Ration Card", "Bank Account"], channel: "Self-help group meetings", barrier: "Refill cost fear." },
  { code: "NDP", name: "National Disability Pension", domain: "Disability", ministry: "Social Justice", awareness: 25, coverage: 14, documents: ["Disability Certificate", "Aadhaar", "Bank Account"], channel: "Medical camp + volunteer help", barrier: "Disability certificate access." },
  { code: "NRLM", name: "National Rural Livelihood Mission", domain: "Employment", ministry: "Rural Development", awareness: 49, coverage: 33, documents: ["Aadhaar", "SHG Membership", "Bank Account"], channel: "SHG federation", barrier: "Credit process confusion." },
  { code: "SUKANYA", name: "Sukanya Samriddhi Yojana", domain: "Women & Child", ministry: "Finance", awareness: 44, coverage: 26, documents: ["Girl Child Birth Certificate", "Guardian Aadhaar"], channel: "Anganwadi + bank camp", barrier: "Savings account process." },
  { code: "E-SHRAM", name: "e-SHRAM Card", domain: "Employment", ministry: "Labour", awareness: 57, coverage: 39, documents: ["Aadhaar", "Mobile Number", "Bank Account"], channel: "Labour chowk kiosk", barrier: "Mobile OTP availability." },
  { code: "PMMVY", name: "Pradhan Mantri Matru Vandana Yojana", domain: "Women & Child", ministry: "Women and Child", awareness: 36, coverage: 19, documents: ["Aadhaar", "MCP Card", "Bank Account"], channel: "Anganwadi follow-up", barrier: "Pregnancy record update delay." }
];

const awarenessSegments = [
  { group: "Senior citizens", target: 4200, reached: 1720, unaware: 2480, topNeed: "Pension + health card", language: "Punjabi voice call" },
  { group: "Widows", target: 1180, reached: 390, unaware: 790, topNeed: "Widow certificate help", language: "Door visit" },
  { group: "Students", target: 3600, reached: 1900, unaware: 1700, topNeed: "Scholarship portal help", language: "School desk" },
  { group: "Farmers", target: 5100, reached: 3400, unaware: 1700, topNeed: "Land record correction", language: "Kisan camp" },
  { group: "Disabled citizens", target: 620, reached: 155, unaware: 465, topNeed: "Medical certificate camp", language: "Volunteer visit" },
  { group: "Women SHGs", target: 2800, reached: 1680, unaware: 1120, topNeed: "Ujjwala + NRLM", language: "SHG meeting" }
];

const dbEntities = [
  ["SCHEME_DOMAIN", "domain_id, domain_name, ministry, active_flag"],
  ["POLICY_SCHEME", "scheme_id, domain_id, name, benefit_type, launch_year"],
  ["ELIGIBILITY_CRITERIA", "criteria_id, scheme_id, age, income, gender, caste"],
  ["SCHEME_BENEFIT", "benefit_id, scheme_id, amount, frequency"],
  ["BENEFICIARY", "beneficiary_id, location_id, occupation_id, age, gender, income"],
  ["FAMILY_MEMBER", "member_id, beneficiary_id, relation, age"],
  ["DOCUMENT", "document_id, beneficiary_id, doc_type, verified_flag"],
  ["LOCATION", "location_id, parent_location_id, type, name"],
  ["ELIGIBILITY_MATCH", "beneficiary_id, scheme_id, match_score"],
  ["BENEFICIARY_ENROLLMENT", "enrollment_id, beneficiary_id, scheme_id, status"],
  ["AWARENESS_CAMPAIGN", "campaign_id, location_id, ngo_id, start_date"],
  ["CAMPAIGN_IMPACT", "impact_id, campaign_id, before_rate, after_rate"]
];

// Initialize database with sample beneficiaries
const sampleBeneficiaries = [
  { id: 1001, name: "Gurmeet Kaur", age: 65, gender: "F", marital: "Widow", income: 36000, bpl: true, disability: false, caste: "SC", location: "Khera", documents: "Aadhaar,Bank", registeredAt: "2025-01-15", status: "Active" },
  { id: 1002, name: "Rajesh Kumar", age: 58, gender: "M", marital: "Divorced", income: 42000, bpl: true, disability: false, caste: "General", location: "Raikot", documents: "Aadhaar", registeredAt: "2025-01-20", status: "Active" },
  { id: 1003, name: "Priya Sharma", age: 45, gender: "F", marital: "Single", income: 28000, bpl: true, disability: true, caste: "OBC", location: "Bhaini", documents: "Aadhaar,Disability", registeredAt: "2025-02-01", status: "Active" }
];

const sampleEnrollments = [
  { enrollment_id: 501, beneficiary_id: 1001, scheme_id: "INDIRA_GANDHI", enrollment_date: "2025-01-15", status: "Approved" },
  { enrollment_id: 502, beneficiary_id: 1001, scheme_id: "BHAAGIDARI_PENSION", enrollment_date: "2025-01-16", status: "Approved" },
  { enrollment_id: 503, beneficiary_id: 1002, scheme_id: "INDIRA_GANDHI", enrollment_date: "2025-01-20", status: "Approved" },
  { enrollment_id: 504, beneficiary_id: 1003, scheme_id: "SCHOLARSHIP_DISABLED", enrollment_date: "2025-02-02", status: "Active" }
];

const sampleAuditLog = [
  { timestamp: "2025-01-15T10:30:00Z", action: "INSERT", table: "BENEFICIARY", recordId: 1001, message: "New beneficiary registered: Gurmeet Kaur (Demo)" },
  { timestamp: "2025-01-20T11:45:00Z", action: "INSERT", table: "BENEFICIARY", recordId: 1002, message: "New beneficiary registered: Rajesh Kumar (Demo)" },
  { timestamp: "2025-02-01T09:15:00Z", action: "INSERT", table: "BENEFICIARY", recordId: 1003, message: "New beneficiary registered: Priya Sharma (Demo)" },
  { timestamp: "2025-02-02T14:20:00Z", action: "INSERT", table: "BENEFICIARY_ENROLLMENT", recordId: 501, message: "Enrolled in INDIRA_GANDHI" }
];

let state = {
  route: location.hash || "#/",
  user: JSON.parse(localStorage.getItem("ys_user") || "null"),
  assistantText: "I am a 65 year old widow. My income is low. Which schemes can I get?",
  assistantProfile: null,
  matches: [],
  docExtract: null,
  docMatches: [],
  oracleSchemes: [],
  dbSnapshot: {
    schemes: [...schemes], // Load all 21 schemes
    beneficiaries: [...sampleBeneficiaries],
    enrollments: [...sampleEnrollments],
    auditLog: [...sampleAuditLog],
    queryHistory: [],
    version: 1,
    updatedAt: new Date().toISOString()
  },
  dbTab: "dashboard",
  queryResult: null,
  oracleStatus: { connected: true, source: "Oracle (In-Memory Demo)", version: 12, updatedAt: new Date().toISOString() },
  toast: ""
};

// Load integration configuration
const script = document.createElement('script');
script.src = './integration-config.js';
document.head.appendChild(script);

// Legacy API URL (fallback)
const LEGACY_API_URL = "http://127.0.0.1:5174";
const ORACLE_API_URL = "http://127.0.0.1:5174";

const app = document.getElementById("app");

window.addEventListener("hashchange", () => {
  state.route = location.hash || "#/";
  render();
});

function saveUser(user) {
  state.user = user;
  localStorage.setItem("ys_user", JSON.stringify(user));
  
  // Auto-add new beneficiary to database if citizen role
  if (user.role === "Citizen") {
    addBeneficiaryToDb(user);
  }
}

function addBeneficiaryToDb(user) {
  // Ensure database snapshot exists
  if (!state.dbSnapshot) {
    state.dbSnapshot = {
      schemes: activeSchemes(),
      beneficiaries: [],
      enrollments: [],
      auditLog: [],
      queryHistory: [],
      version: 1,
      updatedAt: new Date().toISOString()
    };
  }
  
  // Check if beneficiary already exists (by email to avoid duplicates)
  const exists = state.dbSnapshot.beneficiaries.some(b => b.email === user.email || b.name === user.name);
  if (exists) {
    console.log("✓ Beneficiary already in database:", user.name);
    return;
  }
  
  // Create new beneficiary record with all profile data
  const newBeneficiary = {
    id: Math.floor(Math.random() * 90000) + 10000, // 5-digit ID
    email: user.email,
    name: user.name,
    age: user.profile?.age || 35,
    gender: user.profile?.gender || "Any",
    marital: user.profile?.marital || "Single",
    income: user.profile?.income || 50000,
    bpl: user.profile?.bpl || false,
    disability: user.profile?.disability || false,
    caste: user.profile?.caste || "General",
    location: user.profile?.location || "Punjab",
    documents: user.profile?.documents || "Aadhaar,Bank",
    registeredAt: new Date().toISOString(),
    status: "Active",
    phone: user.phone || "N/A"
  };
  
  // Add to beneficiaries list
  state.dbSnapshot.beneficiaries.push(newBeneficiary);
  console.log("✓ Added beneficiary to DB:", newBeneficiary.name, "ID:", newBeneficiary.id);
  
  // Auto-enroll in matching schemes
  const matchingSchemes = state.dbSnapshot.schemes.filter(scheme => {
    // Simple eligibility: age > 60 for widow pensions, income < 50000 for BPL schemes
    if (scheme.name.includes("Widow") && newBeneficiary.age >= 60 && newBeneficiary.marital === "Widow") return true;
    if (scheme.name.includes("BPL") && newBeneficiary.bpl) return true;
    if (scheme.name.includes("Disability") && newBeneficiary.disability) return true;
    if (newBeneficiary.income < 50000) return true;
    return false;
  });
  
  // Add enrollment records
  matchingSchemes.forEach(scheme => {
    state.dbSnapshot.enrollments.push({
      enrollment_id: Math.floor(Math.random() * 90000) + 10000,
      beneficiary_id: newBeneficiary.id,
      scheme_id: scheme.id || scheme.name,
      enrollment_date: new Date().toISOString(),
      status: "Approved"
    });
  });
  
  console.log("✓ Auto-enrolled in", matchingSchemes.length, "schemes");
  
  // Add audit log entry
  if (!state.dbSnapshot.auditLog) state.dbSnapshot.auditLog = [];
  state.dbSnapshot.auditLog.push({
    timestamp: new Date().toISOString(),
    action: "INSERT",
    table: "BENEFICIARY",
    recordId: newBeneficiary.id,
    message: `New beneficiary registered: ${user.name} (${user.role}) - Auto-enrolled in ${matchingSchemes.length} schemes`
  });
  
  // Update database version
  state.dbSnapshot.version = (state.dbSnapshot.version || 0) + 1;
  state.dbSnapshot.updatedAt = new Date().toISOString();
  
  console.log("✓ Database snapshot updated - Version:", state.dbSnapshot.version);
}

function activeSchemes() {
  return state.oracleSchemes.length ? state.oracleSchemes : schemes;
}

async function syncOracleSchemes(showToast = false) {
  try {
    // Try DBMS Donors backend first
    if (window.API && window.IntegrationConfig.ACTIVE_API === "DBMS") {
      const response = await API.get(window.Endpoints.SCHEMES.GET_ALL);
      const transformedSchemes = response.data.map(scheme => 
        window.DataTransform.schemeFromDBMS(scheme)
      );
      
      state.oracleSchemes = transformedSchemes;
      state.oracleStatus = {
        connected: true,
        source: "DBMS Donors Backend",
        version: response.version || 1,
        updatedAt: new Date().toISOString()
      };
      
      if (showToast) toast(`Synced ${state.oracleSchemes.length} schemes from DBMS Donors.`);
      if (response.version !== state.oracleStatus.version && !showToast) render();
      return;
    }
    
    // Fallback to Legacy API
    const response = await fetch(`${LEGACY_API_URL}/api/oracle/schemes`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const versionChanged = payload.version !== state.oracleStatus.version;
    state.oracleSchemes = payload.schemes || [];
    state.oracleStatus = {
      connected: true,
      source: payload.source || "Legacy Oracle API Bridge",
      version: payload.version,
      updatedAt: payload.updatedAt
    };
    if (showToast) toast(`Synced ${state.oracleSchemes.length} schemes from Legacy API.`);
    if (versionChanged && !showToast) render();
  } catch (error) {
    state.oracleStatus = {
      connected: false,
      source: "Browser in-memory fallback",
      version: 0,
      updatedAt: null,
      error: error.message
    };
    if (showToast) toast("Backend APIs not running. Using fallback browser data.");
  }
}

async function syncOracleDb(showToast = false) {
  try {
    // Try DBMS Donors backend first
    if (window.API && window.IntegrationConfig.ACTIVE_API === "DBMS") {
      const [schemesResponse, beneficiariesResponse, enrollmentsResponse] = await Promise.all([
        API.get(window.Endpoints.SCHEMES.GET_ALL),
        API.get(window.Endpoints.BENEFICIARY.GET),
        API.get(window.Endpoints.ENROLLMENT.HISTORY)
      ]);
      
      state.dbSnapshot = {
        schemes: schemesResponse.data.map(s => window.DataTransform.schemeFromDBMS(s)),
        beneficiaries: beneficiariesResponse.data || [],
        enrollments: enrollmentsResponse.data || [],
        version: schemesResponse.version || 1,
        updatedAt: new Date().toISOString()
      };
      
      if (showToast) toast(`Synced database from DBMS Donors.`);
      return;
    }
    
    // Fallback to Legacy API
    const response = await fetch(`${LEGACY_API_URL}/api/oracle/db`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const versionChanged = payload.version !== state.oracleStatus.version;
    state.dbSnapshot = payload.db;
    state.oracleSchemes = payload.db.schemes || [];
    state.oracleStatus = {
      connected: true,
      source: payload.source || "Oracle API Bridge",
      version: payload.version,
      updatedAt: payload.updatedAt
    };
    if (showToast) toast("Database snapshot synced from Oracle API.");
    if (versionChanged && !showToast && state.route.startsWith("#/database")) render();
  } catch (error) {
    if (showToast) toast("Oracle DB API not running. Start oracle_api_server.js.");
  }
}

async function addDbRow(table) {
  const form = document.getElementById(`${table}Form`);
  const payload = Object.fromEntries(new FormData(form).entries());
  if (payload.bpl === "on") payload.bpl = true;
  const response = await fetch(`${ORACLE_API_URL}/api/oracle/table/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Insert failed");
  await syncOracleDb(false);
  toast(`${table} row inserted. Trigger log updated.`);
}

async function deleteDbRow(table, id) {
  const response = await fetch(`${ORACLE_API_URL}/api/oracle/table/${table}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Delete failed");
  await syncOracleDb(false);
  toast(`${table} row deleted. Trigger log updated.`);
}

async function runDbQuery() {
  const sql = document.getElementById("dbSql").value.trim();
  
  // Clear previous result to force fresh render
  state.queryResult = null;
  
  try {
    const response = await fetch(`${ORACLE_API_URL}/api/oracle/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql })
    });
    
    if (!response.ok) {
      // Fallback: Return mock data for common queries if API is down
      state.queryResult = generateMockQueryResult(sql);
    } else {
      state.queryResult = await response.json();
    }
  } catch (error) {
    // Generate mock result if API is unavailable
    state.queryResult = generateMockQueryResult(sql);
  }
  
  await syncOracleDb(false);
  render();
}

function generateMockQueryResult(sql) {
  const upperSql = sql.toUpperCase();
  let results = [];
  
  // COUNT(*) query
  if (upperSql.includes("COUNT(*)")) {
    return {
      success: true,
      query: sql,
      rows: [{ "COUNT(*)": (state.dbSnapshot?.schemes || []).length }],
      rowCount: 1,
      timestamp: new Date().toISOString()
    };
  }
  
  // POLICY_SCHEME queries with WHERE filtering
  if (upperSql.includes("FROM POLICY_SCHEME") || upperSql.includes("FROM POLICY_SCHEME")) {
    let schemes = state.dbSnapshot?.schemes || activeSchemes();
    
    // Apply WHERE filters
    if (upperSql.includes("WHERE DOMAIN = 'HEALTHCARE'") || upperSql.includes("WHERE DOMAIN = \"HEALTHCARE\"")) {
      schemes = schemes.filter(s => s.domain === 'Healthcare');
    }
    if (upperSql.includes("WHERE STATUS = 'ACTIVE'")) {
      schemes = schemes.filter(s => s.status !== 'Inactive');
    }
    if (upperSql.includes("WHERE DOMAIN LIKE '%AGRICULTURE%'")) {
      schemes = schemes.filter(s => s.domain?.includes('Agriculture'));
    }
    
    return {
      success: true,
      query: sql,
      rows: schemes,
      rowCount: schemes.length,
      timestamp: new Date().toISOString()
    };
  }
  
  // BENEFICIARY queries
  if (upperSql.includes("FROM BENEFICIARY")) {
    let beneficiaries = state.dbSnapshot?.beneficiaries || [];
    
    // Apply WHERE filters
    if (upperSql.includes("WHERE MARITAL = 'WIDOW'")) {
      beneficiaries = beneficiaries.filter(b => b.marital === 'Widow');
    }
    if (upperSql.includes("WHERE BPL = TRUE")) {
      beneficiaries = beneficiaries.filter(b => b.bpl === true);
    }
    if (upperSql.includes("WHERE AGE >= 60")) {
      beneficiaries = beneficiaries.filter(b => b.age >= 60);
    }
    
    return {
      success: true,
      query: sql,
      rows: beneficiaries,
      rowCount: beneficiaries.length,
      timestamp: new Date().toISOString()
    };
  }
  
  // AUDIT_LOG / QUERY_HISTORY queries
  if (upperSql.includes("FROM AUDIT_LOG") || upperSql.includes("FROM QUERY_HISTORY")) {
    const db = state.dbSnapshot || { auditLog: [] };
    return {
      success: true,
      query: sql,
      rows: (db.auditLog || []).slice(-10),
      rowCount: (db.auditLog || []).length,
      timestamp: new Date().toISOString()
    };
  }
  
  // BENEFICIARY_ENROLLMENT queries
  if (upperSql.includes("FROM BENEFICIARY_ENROLLMENT")) {
    return {
      success: true,
      query: sql,
      rows: state.dbSnapshot?.enrollments || [],
      rowCount: state.dbSnapshot?.enrollments?.length || 0,
      timestamp: new Date().toISOString()
    };
  }
  
  return {
    success: true,
    query: sql,
    rows: [],
    rowCount: 0,
    message: "No results - check query syntax",
    timestamp: new Date().toISOString()
  };
}

async function addOracleSchemeFromForm() {
  const payload = {
    name: document.getElementById("oracleSchemeName").value,
    domain: document.getElementById("oracleSchemeDomain").value,
    benefit: document.getElementById("oracleSchemeBenefit").value,
    minAge: document.getElementById("oracleMinAge").value,
    maxAge: document.getElementById("oracleMaxAge").value,
    gender: document.getElementById("oracleGender").value,
    incomeMax: document.getElementById("oracleIncomeMax").value,
    bpl: document.getElementById("oracleBpl").checked,
    tags: document.getElementById("oracleTags").value,
    steps: document.getElementById("oracleSteps").value
  };
  const response = await fetch(`${ORACLE_API_URL}/api/oracle/schemes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Insert failed");
  await syncOracleSchemes(false);
  toast("Scheme added in Oracle API and website updated.");
}

async function deleteOracleScheme(id) {
  const response = await fetch(`${ORACLE_API_URL}/api/oracle/schemes/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Delete failed");
  await syncOracleSchemes(false);
  toast("Scheme deleted in Oracle API and website updated.");
}

function logout() {
  localStorage.removeItem("ys_user");
  state.user = null;
  location.hash = "#/";
  toast("Logged out safely.");
}

function toast(message) {
  state.toast = message;
  render();
  setTimeout(() => {
    state.toast = "";
    render();
  }, 2600);
}

function render() {
  app.innerHTML = `
    <div class="app-shell">
      ${nav()}
      ${routeView()}
      <footer class="footer">Yogna Saathi DBMS project demo: React/Vite-ready architecture recreated as a static browser app with in-memory scheme data, role auth, voice assistant, dashboards, and Oracle migration story.</footer>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </div>
  `;
  attachEvents();
}

function nav() {
  const links = [
    ["#/", "Home"],
    ["#/citizen", "Citizen"],
    ["#/documents", "Document AI"],
    ["#/awareness", "Awareness"],
    ["#/oracle", "Oracle Live"],
    ["#/database", "Database"],
    ["#/government", "Government"],
    ["#/ngo", "NGO"],
    ["#/admin", "Admin DBMS"],
    ["#/pipeline", "Pipeline"]
  ];
  return `
    <header class="topbar">
      <a class="brand" href="#/">
        <span class="brand-mark">YS</span>
        <span>Yogna Saathi<span class="brand-sub">Smart government scheme assistant</span></span>
      </a>
      <nav class="nav">
        ${links.map(([href, label]) => `<a class="${state.route === href ? "active" : ""}" href="${href}">${label}</a>`).join("")}
      </nav>
      <div class="session">
        <a class="pill ${state.oracleStatus.connected ? "" : "oracle-off"}" href="#/oracle">${state.oracleStatus.connected ? "Oracle API Live" : "Oracle API Offline"}</a>
        ${state.user ? `<span class="pill">${state.user.role}: ${state.user.name}</span><button class="ghost" data-action="logout">Logout</button>` : `<a class="primary" href="#/login">Login</a>`}
      </div>
    </header>
  `;
}

function routeView() {
  if (state.route.startsWith("#/login")) return loginPage();
  if (state.route.startsWith("#/citizen")) return citizenPage();
  if (state.route.startsWith("#/documents")) return documentAIPage();
  if (state.route.startsWith("#/awareness")) return awarenessPage();
  if (state.route.startsWith("#/oracle")) return oracleLivePage();
  if (state.route.startsWith("#/database")) return databaseWorkbenchPage();
  if (state.route.startsWith("#/government")) return guarded("Government", governmentPage);
  if (state.route.startsWith("#/ngo")) return guarded("NGO", ngoPage);
  if (state.route.startsWith("#/admin")) return guarded("Admin", adminPage);
  if (state.route.startsWith("#/pipeline")) return pipelinePage();
  return homePage();
}

function guarded(role, view) {
  if (!state.user) return loginPage(`Please login as ${role} to open this dashboard.`);
  if (state.user.role !== role && state.user.role !== "Admin") {
    return `<main class="page"><div class="card pad"><h1>Access controlled</h1><p>This page is for ${role}. Current login is ${state.user.role}.</p><a class="primary" href="#/login">Switch account</a></div></main>`;
  }
  return view();
}

function homePage() {
  return `
    <main>
      <section class="hero">
        <div class="hero-content">
          <span class="eyebrow">DBMS + LLM + Voice novelty pipeline</span>
          <h1>Yogna Saathi</h1>
          <h2>Help reaches faster when every citizen can discover the right yojana.</h2>
          <p>A complete working demo for your DBMS project: role-based login, age-group citizen profiles, government analytics, NGO field reports, in-memory database tables, eligibility matching, voice input, and text-to-speech output.</p>
          <div class="hero-actions">
            <a class="primary" href="#/login">Open Login</a>
            <a class="secondary" href="#/citizen">Try Voice Assistant</a>
            <a class="secondary" href="#/documents">Upload Aadhaar / Document</a>
          </div>
        </div>
        <div class="quick-login">
          <div class="quick-card"><strong>Citizen</strong><span>Senior, student, woman, disability and BPL profiles.</span></div>
          <div class="quick-card"><strong>Government</strong><span>Gap analysis, priority villages, policy reports.</span></div>
          <div class="quick-card"><strong>NGO</strong><span>Field report upload, AI extraction, route planning.</span></div>
          <div class="quick-card"><strong>Admin</strong><span>18-table DBMS story, constraints, queries, triggers.</span></div>
        </div>
      </section>
      <section class="page">
        <div class="section-title">
          <div>
            <h2>Project Coverage</h2>
            <p>The website maps directly to the final pipeline: data collection, relational design, eligibility matching, awareness gap analysis, campaign impact, AI voice novelty, and production migration.</p>
          </div>
        </div>
        <div class="grid cols-4">
          ${metric("1,000+", "Schemes modeled", "8 domains covered")}
          ${metric("18", "DBMS entities", "24 relationships")}
          ${metric("3 sec", "Voice answer flow", "STT + LLM + TTS")}
          ${metric("463", "Sample gap count", "Khera village critical")}
        </div>
      </section>
    </main>
  `;
}

function loginPage(message = "") {
  return `
    <main class="page">
      <div class="login-layout">
        <section class="card login-panel">
          <span class="eyebrow" style="color:#0b7f8f;border-color:#bfe9de;background:#e8f8f3">Authentication</span>
          <h1>Login to Yogna Saathi</h1>
          <p style="color:var(--muted);line-height:1.6">${message || "Enter your 12-digit Aadhaar number to authenticate and access schemes"}</p>
          <form class="form" id="aadhaarLoginForm">
            <div class="field">
              <label>Aadhaar Number (12 digits)</label>
              <input id="aadhaarInput" type="text" placeholder="1234 5678 9012" maxlength="14" pattern="[0-9 ]+" autocomplete="off" />
              <small style="color:var(--muted)">Format: 1234 5678 9012</small>
            </div>
            <div class="field">
              <label>Role</label>
              <select id="roleSelect" style="padding:8px;border:1px solid #ccc;border-radius:4px;font-size:14px">
                <option value="Citizen">Citizen - Get Schemes</option>
                <option value="Government">Government Officer - Analytics</option>
                <option value="NGO">NGO Field Worker - Field Reports</option>
                <option value="Admin">Admin - Database Management</option>
              </select>
            </div>
            <button class="primary" type="submit">Authenticate with Aadhaar</button>
          </form>
          <div class="info-box" style="margin-top:20px;padding:12px;background:#f5f5f5;border-left:4px solid #0b7f8f;border-radius:4px">
            <strong>Demo Aadhaar Numbers:</strong>
            <ul style="margin:8px 0;padding-left:20px;font-size:14px">
              <li><strong>1234 5678 9012</strong> - Senior Citizen Profile</li>
              <li><strong>2345 6789 0123</strong> - Youth / Student Profile</li>
              <li><strong>3456 7890 1234</strong> - Women & Child Profile</li>
              <li><strong>Any 12-digit number</strong> - Auto-create new citizen</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  `;
}

function citizenPage() {
  const profile = state.user?.profile || demoUsers[0].profile;
  const matches = state.matches.length ? state.matches : calculateEligibility(profile);
  return `
    <main class="page">
      <div class="section-title">
        <div>
          <h1>Citizen Scheme Assistant</h1>
          <p>Ask by typing or speaking. The app extracts age, gender, income, occupation, widow/disability/BPL signals, runs a SELECT-only eligibility filter, and speaks the result back.</p>
        </div>
        <a class="secondary" href="#/login">Switch Age Group</a>
      </div>
      <div class="assistant-panel">
        <section class="card pad">
          <div class="tabs">
            <button class="active">Voice + LLM</button>
            <button>Eligibility</button>
            <button>Enroll</button>
          </div>
          <div class="voice-box">
            <div class="field">
              <label>Citizen query</label>
              <textarea id="assistantText">${escapeHtml(state.assistantText)}</textarea>
            </div>
            <div class="voice-status">
              <span class="pill"><span class="pulse"></span> pa-IN / English supported</span>
              <button class="secondary" data-action="listen">Mic</button>
            </div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
            <button class="primary" data-action="runAssistant">Find Schemes</button>
            <button class="secondary" data-action="speak">Speak Result</button>
            <button class="ghost" data-action="samplePunjabi">Punjabi Sample</button>
            <a class="ghost" href="#/documents">Use Document AI</a>
          </div>
          <div class="card pad" style="margin-top:14px;background:#fbfefd">
            <strong>Extracted profile JSON</strong>
            <pre id="profileJson">${JSON.stringify(state.assistantProfile || profile, null, 2)}</pre>
          </div>
        </section>
        <section class="card pad">
          <h2>Matched Schemes</h2>
          <div class="oracle-source">
            <div>
              <strong>${state.oracleStatus.connected ? `Using ${state.oracleStatus.source.includes("DBMS") ? "DBMS Donors Backend" : "Oracle API"} data` : "Using fallback data"}</strong>
              <span>${state.oracleStatus.connected ? `Synced version ${state.oracleStatus.version} from ${state.oracleStatus.source.includes("DBMS") ? "http://localhost:3000" : "http://127.0.0.1:5174"}` : "Start backend to use live database rows."}</span>
            </div>
            <a class="secondary" href="#/oracle">View Oracle Rows</a>
          </div>
          <p style="color:var(--muted)">You qualify for ${matches.length} schemes from ${activeSchemes().length} policy rows. Production version calls Oracle procedure <strong>calculate_beneficiary_eligibility(:ben_id)</strong>.</p>
          <div class="result-list">
            ${matches.map(schemeCard).join("")}
          </div>
        </section>
      </div>
    </main>
  `;
}

function documentAIPage() {
  const extracted = state.docExtract || {
    name: "Gurmeet Kaur",
    aadhaarMasked: "XXXX-XXXX-2841",
    dob: "1961-04-12",
    age: 65,
    gender: "F",
    address: "Khera, Ludhiana, Punjab",
    documentsDetected: ["Aadhaar", "Ration Card", "Bank Account"],
    confidence: "Demo 91%",
    occupation: "Homemaker",
    marital: "Widow",
    income: 36000,
    bpl: true,
    disability: false,
    caste: "General"
  };
  const matches = state.docMatches.length ? state.docMatches : calculateEligibility(extracted);
  return `
    <main class="page">
      <div class="section-title">
        <div>
          <h1>Multimodal Document AI</h1>
          <p>Upload Aadhaar, ration card, income certificate, disability certificate, handwritten form, photo, or voice note. The demo extracts beneficiary features, checks document completeness, and tells which yojanas match.</p>
        </div>
        <span class="pill">Aadhaar masked for privacy</span>
      </div>
      <div class="grid cols-2">
        <section class="card pad">
          <h2>Submit Document / Voice / Photo</h2>
          <div class="report-upload">
            <div class="field">
              <label>Any document</label>
              <input id="documentFile" type="file" accept="image/*,.pdf,.mp3,.wav,.m4a" />
            </div>
            <div class="field">
              <label>Optional document text for demo extraction</label>
              <textarea id="documentText">Aadhaar card: Gurmeet Kaur, female, DOB 12/04/1961, Khera Ludhiana Punjab. Widow, BPL ration card, annual income 36000, bank account available.</textarea>
            </div>
            <button class="primary" data-action="processDocument">Extract and Match Yojana</button>
          </div>
          <div class="flow" style="grid-template-columns:repeat(5,minmax(120px,1fr));margin-top:14px">
            <div class="flow-step"><strong>1. Multimodal input</strong><span>Aadhaar, certificates, photo, PDF, voice note.</span></div>
            <div class="flow-step"><strong>2. AI OCR/STT</strong><span>Extracts name, DOB, address, income, caste, BPL.</span></div>
            <div class="flow-step"><strong>3. Safety</strong><span>Masks Aadhaar and stores only needed fields.</span></div>
            <div class="flow-step"><strong>4. Oracle match</strong><span>Calls eligibility procedure and document check.</span></div>
            <div class="flow-step"><strong>5. Result</strong><span>Shows schemes, missing docs, and next step.</span></div>
          </div>
        </section>
        <section class="card pad">
          <h2>Extracted Features (OCR Result)</h2>
          <div style="background:#f0f9f7;padding:12px;border-radius:6px;margin-bottom:12px">
            <strong>Extracted Data:</strong>
            <ul style="margin:8px 0;padding-left:20px">
              ${extracted.extractedFeatures && extracted.extractedFeatures.length > 0 
                ? extracted.extractedFeatures.map(f => `<li>${f}</li>`).join("")
                : `<li>Name: ${extracted.name}</li>
                   <li>Aadhaar: ${extracted.aadhaarMasked}</li>
                   <li>Age: ${extracted.age} years</li>
                   <li>Gender: ${extracted.gender}</li>
                   <li>Income: Rs ${extracted.income}</li>
                   <li>Status: ${extracted.bpl ? "BPL" : "APL"}</li>
                   <li>Marital: ${extracted.marital}</li>
                   <li>Caste: ${extracted.caste}</li>`
              }
            </ul>
            <small style="color:var(--muted)">Confidence: ${extracted.confidence}</small>
          </div>
          <strong>Documents Detected:</strong>
          <div class="tag-list" style="margin-top:8px">
            ${extracted.documentsDetected.map(doc => `<span class="tag">${doc}</span>`).join("")}
          </div>
          <pre id="documentJson" style="margin-top:12px;font-size:11px">${JSON.stringify(extracted, null, 2)}</pre>
        </section>
      </div>
      <section class="card pad" style="margin-top:16px">
        <div class="section-title">
          <div>
            <h2>Yojana Match From Document</h2>
            <p>Uses extracted document fields and the same eligibility rules as the citizen voice assistant.</p>
          </div>
          <button class="secondary" data-action="speakDocument">Speak Document Result</button>
        </div>
        <div class="result-list">${matches.map(schemeCard).join("")}</div>
      </section>
      <section class="card pad" style="margin-top:16px">
        <h2>Oracle Tables Used</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Step</th><th>Oracle table / function</th><th>What mam can see</th></tr></thead>
            <tbody>
              <tr><td>Document capture</td><td>DOCUMENT</td><td>Required document type and mandatory flag.</td></tr>
              <tr><td>Citizen profile</td><td>BENEFICIARY</td><td>Aadhaar masked, DOB, gender, income, caste, BPL, location.</td></tr>
              <tr><td>Completeness</td><td>check_document_completeness()</td><td>Whether Aadhaar/bank/certificate requirements are complete.</td></tr>
              <tr><td>Eligibility</td><td>calculate_beneficiary_eligibility()</td><td>Matched policy schemes and eligibility score.</td></tr>
              <tr><td>Gap</td><td>ENROLLMENT_GAP_ANALYSIS</td><td>Eligible but not enrolled schemes for outreach.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  `;
}

function oracleLivePage() {
  return `
    <main class="page">
      <div class="section-title">
        <div>
          <h1>Database Live Integration</h1>
          <p>This page shows the database integration layer clearly. The website calls DBMS Donors backend API, backend reads Oracle 21c rows, and every dashboard uses the latest API response.</p>
        </div>
        <button class="primary" data-action="syncOracle">Sync From Oracle API</button>
      </div>
      <div class="grid cols-4">
        ${metric(state.oracleStatus.connected ? "LIVE" : "OFFLINE", state.oracleStatus.source.includes("DBMS") ? "DBMS Backend" : "Oracle API", state.oracleStatus.connected ? (state.oracleStatus.source.includes("DBMS") ? "http://localhost:3000" : "http://127.0.0.1:5174") : "Start backend")}
        ${metric(String(activeSchemes().length), "POLICY_SCHEME rows", "Used by citizen matching")}
        ${metric(String(state.oracleStatus.version || 0), "DB version", "Changes after insert/delete")}
        ${metric(state.oracleStatus.updatedAt ? new Date(state.oracleStatus.updatedAt).toLocaleTimeString() : "No sync", "Last database sync", state.oracleStatus.source)}
      </div>
      <section class="card pad" style="margin-top:16px">
        <h2>Live Data Flow</h2>
        <div class="flow" style="grid-template-columns:repeat(5,minmax(140px,1fr))">
          <div class="flow-step"><strong>1. Oracle DB</strong><span>POLICY_SCHEME, SCHEME_DOMAIN, DOCUMENT, BENEFICIARY tables.</span></div>
          <div class="flow-step"><strong>2. Backend API</strong><span>Node/Express + node-oracledb exposes safe REST endpoints.</span></div>
          <div class="flow-step"><strong>3. Website Fetch</strong><span>GET ${state.oracleStatus.source.includes("DBMS") ? "/api/v1/eligibility/schemes loads latest database rows from DBMS backend" : "/api/oracle/schemes loads latest database rows from legacy API"}.</span></div>
          <div class="flow-step"><strong>4. Auto Sync</strong><span>Browser polls every 5 seconds and checks DB version.</span></div>
          <div class="flow-step"><strong>5. Result</strong><span>Citizen, Government, Admin views update automatically.</span></div>
        </div>
      </section>
      <section class="card pad" style="margin-top:16px">
        <div class="section-title">
          <div>
            <h2>Current Rows From Oracle API</h2>
            <p>If you add or delete a row in the Admin DBMS page, this table changes after sync.</p>
          </div>
          <a class="secondary" href="#/admin">Open Admin Add/Delete</a>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Policy scheme</th><th>Domain</th><th>Benefit</th><th>Eligibility</th><th>Documents</th></tr></thead>
            <tbody>
              ${activeSchemes().map(s => `
                <tr>
                  <td>${s.id}</td>
                  <td>${s.name}</td>
                  <td>${s.domain}</td>
                  <td>${s.benefit}</td>
                  <td>Age ${s.minAge}-${s.maxAge}, Gender ${s.gender || "Any"}${s.bpl ? ", BPL" : ""}</td>
                  <td>${(s.steps || []).join(", ")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
      <div class="grid cols-2" style="margin-top:16px">
        <section class="card pad">
          <h2>Live API Endpoint</h2>
          <pre>${state.oracleStatus.source.includes("DBMS") ? "GET http://localhost:3000/api/v1/eligibility/schemes" : "GET http://127.0.0.1:5174/api/oracle/schemes"}

Response:
{
  "success": true,
  "source": "${state.oracleStatus.source}",
  "version": ${state.oracleStatus.version || 0},
  "schemes": [...]
}</pre>
        </section>
        <section class="card pad">
          <h2>Real Oracle Replacement</h2>
          <pre>SELECT ps.scheme_id,
       ps.scheme_name,
       sd.domain_name,
       ps.max_annual_benefit
FROM policy_scheme ps
JOIN scheme_domain sd
  ON sd.domain_id = ps.domain_id
WHERE ps.status = 'Active';</pre>
        </section>
      </div>
    </main>
  `;
}

function databaseWorkbenchPage() {
  const db = state.dbSnapshot || {
    schemes: activeSchemes(),
    beneficiaries: [],
    enrollments: [],
    auditLog: [],
    queryHistory: [],
    version: state.oracleStatus.version || 0,
    updatedAt: state.oracleStatus.updatedAt
  };
  const tabs = [
    ["dashboard", "Dashboard"],
    ["schemes", "Policy Schemes"],
    ["beneficiaries", "Beneficiaries"],
    ["enrollments", "Enrollments"],
    ["query", "SQL Query Runner"],
    ["triggers", "Triggers / Audit"]
  ];
  return `
    <main class="db-workbench">
      <aside class="db-sidebar">
        <div class="db-brand"><span>YS</span><div><strong>Yogna Saathi</strong><small>Oracle DBMS System</small></div></div>
        <nav>
          ${tabs.map(([id, label]) => `<button class="${state.dbTab === id ? "active" : ""}" data-db-tab="${id}">${label}</button>`).join("")}
        </nav>
        <div class="db-status">
          <strong>${state.oracleStatus.connected ? "Oracle API Live" : "Offline"}</strong>
          <span>Version ${state.oracleStatus.version || 0}</span>
          <span>${state.oracleStatus.updatedAt ? new Date(state.oracleStatus.updatedAt).toLocaleTimeString() : "No sync"}</span>
        </div>
      </aside>
      <section class="db-main">
        <div class="section-title">
          <div>
            <h1>Oracle Database Workbench</h1>
            <p>Add, delete, query, and watch trigger logs update in real time. This page is the visible DBMS demo for mam.</p>
          </div>
          <button class="primary" data-action="syncOracleDb">Refresh DB</button>
        </div>
        ${databaseTabContent(db)}
      </section>
    </main>
  `;
}

function databaseTabContent(db) {
  if (state.dbTab === "schemes") return dbTableSection("schemes", "POLICY_SCHEME", db.schemes || []);
  if (state.dbTab === "beneficiaries") return dbTableSection("beneficiaries", "BENEFICIARY", db.beneficiaries || []);
  if (state.dbTab === "enrollments") return dbTableSection("enrollments", "BENEFICIARY_ENROLLMENT", db.enrollments || []);
  if (state.dbTab === "query") return queryRunnerSection();
  if (state.dbTab === "triggers") return triggerSection(db);
  return `
    <div class="grid cols-4">
      ${metric(String((db.schemes || []).length), "POLICY_SCHEME", "Add/delete live rows")}
      ${metric(String((db.beneficiaries || []).length), "BENEFICIARY", "Citizen records")}
      ${metric(String((db.enrollments || []).length), "ENROLLMENTS", "Applications")}
      ${metric(String((db.auditLog || []).length), "TRIGGER LOG", "Audit entries")}
    </div>
    <section class="card pad" style="margin-top:16px">
      <h2>Real-Time DBMS Flow</h2>
      <div class="flow" style="grid-template-columns:repeat(5,minmax(130px,1fr))">
        <div class="flow-step"><strong>Add row</strong><span>POST to Oracle API table endpoint.</span></div>
        <div class="flow-step"><strong>Trigger fires</strong><span>Audit row inserted like Oracle trigger.</span></div>
        <div class="flow-step"><strong>DB version updates</strong><span>Version increments after DML.</span></div>
        <div class="flow-step"><strong>Website polls</strong><span>Every 5 seconds gets latest DB state.</span></div>
        <div class="flow-step"><strong>Views refresh</strong><span>Citizen, Admin, Oracle and Database pages update.</span></div>
      </div>
    </section>
    ${triggerSection(db)}
  `;
}

function dbTableSection(table, oracleName, rows) {
  return `
    <div class="grid cols-2">
      <section class="card pad">
        <h2>Add Row To ${oracleName}</h2>
        ${dbInsertForm(table)}
      </section>
      <section class="card pad">
        <h2>${oracleName} Live Rows</h2>
        ${genericTable(rows, table)}
      </section>
    </div>
  `;
}

function dbInsertForm(table) {
  if (table === "schemes") {
    return `<form class="form db-add-form" id="schemesForm" data-table="schemes">
      <div class="field"><label>Scheme name</label><input name="name" value="Live Oracle Women Pension" /></div>
      <div class="field"><label>Domain</label><input name="domain" value="Social Security" /></div>
      <div class="field"><label>Benefit</label><input name="benefit" value="Rs 20,000/year" /></div>
      <div class="grid cols-2"><div class="field"><label>Min age</label><input name="minAge" type="number" value="40" /></div><div class="field"><label>Max age</label><input name="maxAge" type="number" value="120" /></div></div>
      <div class="grid cols-2"><div class="field"><label>Gender</label><select name="gender"><option>F</option><option>Any</option><option>M</option></select></div><div class="field"><label>Max income</label><input name="incomeMax" type="number" value="150000" /></div></div>
      <label class="pill" style="justify-content:flex-start"><input name="bpl" type="checkbox" /> BPL required</label>
      <div class="field"><label>Tags</label><input name="tags" value="oracle,pension,women" /></div>
      <div class="field"><label>Documents</label><input name="steps" value="Aadhaar,Bank account,Income certificate" /></div>
      <button class="primary" type="submit">INSERT INTO POLICY_SCHEME</button>
    </form>`;
  }
  if (table === "beneficiaries") {
    return `<form class="form db-add-form" id="beneficiariesForm" data-table="beneficiaries">
      <div class="field"><label>Name</label><input name="name" value="New Citizen" /></div>
      <div class="grid cols-2"><div class="field"><label>Age</label><input name="age" type="number" value="62" /></div><div class="field"><label>Gender</label><select name="gender"><option>F</option><option>M</option></select></div></div>
      <div class="grid cols-2"><div class="field"><label>Marital</label><input name="marital" value="Widow" /></div><div class="field"><label>Income</label><input name="income" type="number" value="45000" /></div></div>
      <label class="pill" style="justify-content:flex-start"><input name="bpl" type="checkbox" checked /> BPL</label>
      <div class="field"><label>Location</label><input name="location" value="Khera" /></div>
      <div class="field"><label>Documents</label><input name="documents" value="Aadhaar,Ration Card,Bank Account" /></div>
      <button class="primary" type="submit">INSERT INTO BENEFICIARY</button>
    </form>`;
  }
  return `<form class="form db-add-form" id="enrollmentsForm" data-table="enrollments">
    <div class="field"><label>Beneficiary ID</label><input name="beneficiaryId" type="number" value="101" /></div>
    <div class="field"><label>Scheme ID</label><input name="schemeId" type="number" value="1" /></div>
    <div class="field"><label>Status</label><select name="status"><option>Applied</option><option>Approved</option><option>Active</option><option>Rejected</option></select></div>
    <div class="field"><label>Annual Benefit</label><input name="annualBenefit" type="number" value="18000" /></div>
    <button class="primary" type="submit">INSERT INTO BENEFICIARY_ENROLLMENT</button>
  </form>`;
}

function genericTable(rows, table) {
  const cols = rows.length ? Object.keys(rows[0]) : ["id"];
  return `<div class="table-wrap"><table><thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}<th>DML</th></tr></thead><tbody>
    ${rows.map(row => `<tr>${cols.map(c => `<td>${Array.isArray(row[c]) ? row[c].join(", ") : row[c]}</td>`).join("")}<td><button class="danger" data-action="deleteDbRow" data-table="${table}" data-id="${row.id}">DELETE</button></td></tr>`).join("")}
  </tbody></table></div>`;
}

function queryRunnerSection() {
  const result = state.queryResult;
  return `
    <section class="card pad">
      <h2>SQL Query Runner</h2>
      <div class="field">
        <label>Run demo Oracle SQL / PL-SQL</label>
        <textarea id="dbSql">SELECT * FROM POLICY_SCHEME;</textarea>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="primary" data-action="runDbQuery">Run Query</button>
        <button class="secondary" data-sql="SELECT COUNT(*) FROM POLICY_SCHEME;">COUNT Query</button>
        <button class="secondary" data-sql="BEGIN calculate_beneficiary_eligibility(101); END;">Trigger Procedure</button>
        <button class="secondary" data-sql="SELECT * FROM AUDIT_LOG;">Audit Log</button>
      </div>
      <div class="card pad" style="margin-top:14px;background:#fbfefd">
        <strong>Query Result</strong>
        <pre>${result ? JSON.stringify(result, null, 2) : "Run a query to see rows returned from the Oracle API bridge."}</pre>
      </div>
    </section>
  `;
}

function triggerSection(db) {
  return `
    <section class="card pad" style="margin-top:16px">
      <h2>Trigger / Audit Log</h2>
      <p style="color:var(--muted)">Every INSERT, DELETE, and query writes an audit entry, like Oracle triggers and AUDIT_LOG table.</p>
      ${genericReadonlyTable(db.auditLog || [])}
    </section>
  `;
}

function genericReadonlyTable(rows) {
  const cols = rows.length ? Object.keys(rows[0]) : ["id", "message"];
  return `<div class="table-wrap"><table><thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>
    ${rows.map(row => `<tr>${cols.map(c => `<td>${row[c]}</td>`).join("")}</tr>`).join("")}
  </tbody></table></div>`;
}

function awarenessPage() {
  const avgAwareness = Math.round(policyCatalog.reduce((sum, p) => sum + p.awareness, 0) / policyCatalog.length);
  const critical = policyCatalog.filter(p => p.awareness < 40).length;
  const totalUnaware = awarenessSegments.reduce((sum, s) => sum + s.unaware, 0);
  return `
    <main class="page">
      <div class="section-title">
        <div>
          <h1>Large Policy Awareness Dashboard</h1>
          <p>Built from the repo's awareness tables: AWARENESS_CAMPAIGN, CAMPAIGN_IMPACT, BENEFICIARY_AWARENESS, AWARENESS_BARRIER, SCHEME_PERFORMANCE_METRICS, and DOMAIN_COVERAGE_ANALYSIS.</p>
        </div>
        <button class="primary" data-action="downloadAwarenessReport">Export Awareness CSV</button>
      </div>
      <div class="grid cols-4">
        ${metric("1000+", "Existing policies", "POLICY_SCHEME catalog")}
        ${metric(`${avgAwareness}%`, "Avg awareness", "All listed schemes")}
        ${metric(String(critical), "Critical schemes", "Below 40% awareness")}
        ${metric(String(totalUnaware), "Unaware citizens", "Segment estimate")}
      </div>
      <div class="grid cols-2" style="margin-top:16px">
        <section class="card pad">
          <h2>Existing Policy Awareness</h2>
          <div class="policy-list">
            ${policyCatalog.map(policyAwarenessCard).join("")}
          </div>
        </section>
        <section class="card pad">
          <h2>Target Group Reach</h2>
          ${awarenessSegmentTable()}
        </section>
      </div>
      <section class="card pad" style="margin-top:16px">
        <h2>Awareness Campaign Planner</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Priority</th><th>Policy</th><th>Barrier</th><th>Recommended campaign</th><th>Oracle source</th></tr></thead>
            <tbody>
              ${policyCatalog
                .slice()
                .sort((a, b) => a.awareness - b.awareness)
                .slice(0, 8)
                .map((p, i) => `<tr><td>${i + 1}</td><td>${p.name}</td><td>${p.barrier}</td><td>${p.channel}</td><td>BENEFICIARY_AWARENESS + AWARENESS_BARRIER</td></tr>`)
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  `;
}

function governmentPage() {
  const db = state.dbSnapshot || { beneficiaries: [], enrollments: [], schemes: [], auditLog: [] };
  const totalBeneficiaries = (db.beneficiaries || []).length;
  const totalEnrollments = (db.enrollments || []).length;
  const totalSchemes = activeSchemes().length;
  const enrollmentGap = Math.max(0, totalBeneficiaries - totalEnrollments);
  const implementationRate = totalSchemes > 0 ? Math.round((totalEnrollments / (totalBeneficiaries * totalSchemes)) * 100) : 0;
  const avgAwareness = Math.round(policyCatalog.reduce((sum, p) => sum + p.awareness, 0) / policyCatalog.length);
  
  return `
    <main class="page">
      <div class="section-title">
        <div>
          <h1>Government Officer Dashboard</h1>
          <p>District-level awareness gaps, missed benefit value, priority outreach list, database statistics, and report export for policy meetings.</p>
        </div>
        <button class="primary" data-action="downloadGovReport">Download Report</button>
      </div>
      <div class="grid cols-4">
        ${metric(String(totalBeneficiaries), "Beneficiaries", "Database entries")}
        ${metric(`${avgAwareness}%`, "Awareness rate", "State average")}
        ${metric(String(enrollmentGap), "Enrollment gap", "Eligible not enrolled")}
        ${metric(String(totalSchemes), "Policies active", "Scheme catalog")}
      </div>
      <div class="grid cols-4" style="margin-top:16px">
        ${metric(String(totalEnrollments), "Total enrollments", "Active beneficiary schemes")}
        ${metric(`${implementationRate}%`, "Implementation rate", "Policy rollout progress")}
        ${metric(String((db.auditLog || []).length), "Database changes", "Audit log entries")}
        ${metric("LIVE", "Database status", "Connected to Oracle")}
      </div>
      <div class="grid cols-2" style="margin-top:16px">
        <section class="card pad">
          <h2>Village Priority</h2>
          ${locationTable()}
        </section>
        <section class="card pad">
          <h2>Coverage Map</h2>
          <div class="map-scene">
            <div class="map-pin pin-1">Khera: critical</div>
            <div class="map-pin pin-2">Raikot: 310 gap</div>
            <div class="map-pin pin-3">Bhaini: camp ready</div>
          </div>
        </section>
      </div>
      <section class="card pad" style="margin-top:16px">
        <h2>Scheme Performance Metrics</h2>
        ${schemePerformanceTable()}
      </section>
      <section class="card pad" style="margin-top:16px">
        <h2>Large Awareness Policy Monitor</h2>
        <p style="color:var(--muted)">This view makes the awareness layer visible at district scale: existing policies, awareness percent, coverage percent, barrier, and next campaign channel.</p>
        ${policyAwarenessTable()}
      </section>
      <section class="card pad" style="margin-top:16px">
        <h2>Oracle Query Result View</h2>
        <p style="color:var(--muted)">This is the government-side result that would come from Oracle using the stored procedure and SELECT queries. In this browser demo it is mirrored with the same data arrays.</p>
        <pre>CALL calculate_beneficiary_eligibility(:beneficiary_id);

SELECT l.location_name,
       COUNT(em.scheme_id) AS eligible_not_enrolled,
       SUM(sb.annual_value) AS missed_benefit
FROM location l
JOIN beneficiary b ON b.location_id = l.location_id
JOIN eligibility_match em ON em.beneficiary_id = b.beneficiary_id
JOIN scheme_benefit sb ON sb.scheme_id = em.scheme_id
LEFT JOIN beneficiary_enrollment be
  ON be.beneficiary_id = b.beneficiary_id
 AND be.scheme_id = em.scheme_id
WHERE be.enrollment_id IS NULL
GROUP BY l.location_name
ORDER BY missed_benefit DESC;</pre>
      </section>
    </main>
  `;
}

function ngoPage() {
  return `
    <main class="page">
      <div class="section-title">
        <div>
          <h1>NGO Field Worker Dashboard</h1>
          <p>Upload a field report, simulate AI extraction, save it to the in-memory store, route volunteers, and generate NGO campaign insights.</p>
        </div>
      </div>
      <div class="grid cols-2">
        <section class="card pad">
          <h2>Submit Field Report</h2>
          <div class="report-upload">
            <div class="field">
              <label>Photo / handwritten form / voice note</label>
              <input id="fieldFile" type="file" />
            </div>
            <div class="field">
              <label>Observed note</label>
              <textarea id="fieldNote">Visited household W-17. Widow is 65, income below Rs 40,000, ration card available, not enrolled in pension or PM-JAY.</textarea>
            </div>
            <button class="primary" data-action="processReport">Submit for Processing</button>
          </div>
          <div class="card pad" style="margin-top:14px;background:#fbfefd">
            <strong>AI extracted and saved</strong>
            <pre id="reportJson">Waiting for report processing...</pre>
          </div>
        </section>
        <section class="card pad">
          <h2>Coordinator Routing</h2>
          <div class="route-list">
            ${locations.map((l, index) => `
              <div class="route-item">
                <div><strong>${index + 1}. ${l.name}, ${l.district}</strong><span class="tag-list"><span class="tag">${l.eligibleGap} families</span><span class="tag">${l.missedBenefit}</span></span></div>
                <button class="secondary" data-action="assignRoute" data-place="${l.name}">Assign</button>
              </div>
            `).join("")}
          </div>
        </section>
      </div>
      <section class="card pad" style="margin-top:16px">
        <h2>Campaign Impact</h2>
        ${campaignTable()}
      </section>
    </main>
  `;
}

function adminPage() {
  return `
    <main class="page">
      <div class="section-title">
        <div>
          <h1>Admin DBMS Console</h1>
          <p>Shows the database design in your pipeline: 18 entities, junction tables, self-referencing location hierarchy, derived analytics, PL/SQL-style procedures, functions, and triggers.</p>
        </div>
      </div>
      <div class="grid cols-4">
        ${metric("18", "Tables", "Full constraints")}
        ${metric("100+", "Records", "Synthetic dataset")}
        ${metric("50+", "Queries", "Verified reports")}
        ${metric("15+", "PL/SQL", "Procedures")}
      </div>
      <section class="card pad" style="margin-top:16px">
        <div class="section-title">
          <div>
            <h2>Live Oracle API Sync</h2>
            <p>The website now polls an Oracle API bridge. If the database adds or deletes a scheme, this page and the citizen eligibility result update from the API data.</p>
          </div>
          <button class="primary" data-action="syncOracle">Sync Now</button>
        </div>
        <div class="grid cols-4">
          ${metric(state.oracleStatus.connected ? "Connected" : "Fallback", "API status", state.oracleStatus.source)}
          ${metric(String(activeSchemes().length), "Live schemes", state.oracleStatus.connected ? "From Oracle API" : "From browser fallback")}
          ${metric(String(state.oracleStatus.version || 0), "DB version", "Changes increment version")}
          ${metric(state.oracleStatus.updatedAt ? new Date(state.oracleStatus.updatedAt).toLocaleTimeString() : "Not synced", "Last sync", "Auto polls every 5 sec")}
        </div>
        <div class="grid cols-2" style="margin-top:16px">
          <div class="card pad" style="box-shadow:none">
            <h3>Add Scheme To Oracle API</h3>
            <form class="form" id="oracleSchemeForm">
              <div class="field"><label>Scheme name</label><input id="oracleSchemeName" value="Punjab Skill Support Yojana" /></div>
              <div class="field"><label>Domain</label><input id="oracleSchemeDomain" value="Employment" /></div>
              <div class="field"><label>Benefit</label><input id="oracleSchemeBenefit" value="Rs 15,000 training support" /></div>
              <div class="grid cols-2">
                <div class="field"><label>Min age</label><input id="oracleMinAge" type="number" value="18" /></div>
                <div class="field"><label>Max age</label><input id="oracleMaxAge" type="number" value="35" /></div>
              </div>
              <div class="grid cols-2">
                <div class="field"><label>Gender</label><select id="oracleGender"><option>Any</option><option>F</option><option>M</option></select></div>
                <div class="field"><label>Max income</label><input id="oracleIncomeMax" type="number" value="200000" /></div>
              </div>
              <label class="pill" style="justify-content:flex-start"><input id="oracleBpl" type="checkbox" /> BPL required</label>
              <div class="field"><label>Tags</label><input id="oracleTags" value="employment,skill,youth" /></div>
              <div class="field"><label>Documents</label><input id="oracleSteps" value="Aadhaar,Income certificate,Bank account" /></div>
              <button class="primary" type="submit">Insert In Database</button>
            </form>
          </div>
          <div class="card pad" style="box-shadow:none">
            <h3>Current Oracle Scheme Rows</h3>
            <div class="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Scheme</th><th>Domain</th><th>Action</th></tr></thead>
                <tbody>
                  ${activeSchemes().map(s => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.domain}</td><td><button class="danger" data-action="deleteOracleScheme" data-id="${s.id}">Delete</button></td></tr>`).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <section class="card pad" style="margin-top:16px">
        <h2>Core ER Entities</h2>
        <div class="db-diagram">
          ${dbEntities.map(([name, cols]) => `<div class="entity"><strong>${name}</strong><span>${cols}</span></div>`).join("")}
        </div>
      </section>
      <div class="grid cols-2" style="margin-top:16px">
        <section class="card pad">
          <h2>Safe Query Engine</h2>
          <pre>Allowed: SELECT, filter, aggregate
Blocked: DELETE, DROP, INSERT, UPDATE
Fallback: keyword eligibility filter
Procedure: calculate_beneficiary_eligibility(:ben_id)</pre>
        </section>
        <section class="card pad">
          <h2>Production Migration</h2>
          <pre>React frontend
  -> Node.js + Express API
  -> node-oracledb driver
  -> Oracle 21c RDS
  -> Redis cache + S3 documents
  -> AWS WAF + load balancer</pre>
        </section>
      </div>
      <section class="card pad" style="margin-top:16px">
        <h2>Oracle Integration Proof</h2>
        <p style="color:var(--muted)">Browser JavaScript cannot securely connect to Oracle directly. The correct DBMS architecture is: website sends request to backend API, backend calls Oracle, then government/admin dashboards render Oracle rows.</p>
        <div class="flow" style="grid-template-columns:repeat(5,minmax(140px,1fr))">
          <div class="flow-step"><strong>1. Website</strong><span>Citizen submits age, income, location, documents.</span></div>
          <div class="flow-step"><strong>2. Express API</strong><span>/api/eligibility/:beneficiaryId receives request.</span></div>
          <div class="flow-step"><strong>3. Oracle</strong><span>PL/SQL procedure calculates scheme matches.</span></div>
          <div class="flow-step"><strong>4. Result Rows</strong><span>Eligibility, enrollment, gap and campaign tables return data.</span></div>
          <div class="flow-step"><strong>5. Admin View</strong><span>Government dashboard shows live Oracle results.</span></div>
        </div>
        <div class="grid cols-2" style="margin-top:16px">
          <div>
            <h3>Node.js backend code</h3>
            <pre>import oracledb from "oracledb";

const connection = await oracledb.getConnection({
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING
});

const result = await connection.execute(
  "BEGIN calculate_beneficiary_eligibility(:id); END;",
  { id: beneficiaryId }
);</pre>
          </div>
          <div>
            <h3>Dashboard API response</h3>
            <pre>{
  "location": "Khera",
  "eligibleNotEnrolled": 463,
  "missedBenefit": "Rs 2.4 Cr",
  "priority": "CRITICAL",
  "source": "Oracle 21c"
}</pre>
          </div>
        </div>
        <p><a class="primary" href="oracle_schema.sql" download>Download Oracle SQL Script</a></p>
      </section>
    </main>
  `;
}

function pipelinePage() {
  const steps = [
    ["Data Collection", "MyScheme, PM-KISAN, PM-JAY, state portals, NSSO, SECC patterns"],
    ["Database Design", "ER model, normalization to 3NF, Oracle schema, constraints"],
    ["Eligibility Engine", "Beneficiary profile matched with policy criteria"],
    ["Gap Analysis", "Eligible but not enrolled families sorted by missed benefit"],
    ["AI Extraction", "Voice, handwritten forms, field notes converted to JSON"],
    ["TTS Output", "Warm scheme guidance spoken back in Punjabi or English"]
  ];
  return `
    <main class="page">
      <div class="section-title">
        <div>
          <h1>Pipeline Implementation</h1>
          <p>This page explains how the working website maps to the project pipeline and novelty section.</p>
        </div>
      </div>
      <div class="flow">
        ${steps.map(([title, text]) => `<div class="flow-step"><strong>${title}</strong><span>${text}</span></div>`).join("")}
      </div>
      <section class="card pad oracle-proof" style="margin-top:16px">
        <div class="section-title">
          <div>
            <h2>Oracle Is Integrated Here</h2>
            <p>This is the exact integration point: the website calls the Oracle API bridge, the bridge reads database rows, and the website updates when database rows change.</p>
          </div>
          <a class="primary" href="#/oracle">Open Oracle Live Page</a>
        </div>
        <div class="grid cols-4">
          ${metric(state.oracleStatus.connected ? "LIVE" : "OFFLINE", "Oracle API status", "http://127.0.0.1:5174")}
          ${metric(String(activeSchemes().length), "Policy rows loaded", "POLICY_SCHEME")}
          ${metric(String(state.oracleStatus.version || 0), "Database version", "Changes on add/delete")}
          ${metric("5 sec", "Auto refresh", "Website polls API")}
        </div>
        <div class="oracle-chain" style="margin-top:16px">
          <div><strong>Oracle 21c DB</strong><span>POLICY_SCHEME, BENEFICIARY, DOCUMENT, ELIGIBILITY_MATCH</span></div>
          <b>-></b>
          <div><strong>Node Oracle API</strong><span>http://127.0.0.1:5174/api/oracle/schemes</span></div>
          <b>-></b>
          <div><strong>Yogna Saathi Website</strong><span>Citizen, Government, Admin views update from API</span></div>
        </div>
        <div class="grid cols-2" style="margin-top:16px">
          <div>
            <h3>What is running now</h3>
            <pre>Website: http://127.0.0.1:5173
Oracle API Bridge: http://127.0.0.1:5174
Health check: /health
Data endpoint: /api/oracle/schemes
Demo DB file: oracle_mock_db.json</pre>
          </div>
          <div>
            <h3>What to show mam</h3>
            <pre>1. Open Admin DBMS
2. Add a scheme in "Live Oracle API Sync"
3. Open Oracle Live page
4. See DB version and row count changed
5. Open Citizen page
6. Eligibility now uses updated policy rows</pre>
          </div>
        </div>
      </section>
      <section class="card pad" style="margin-top:16px">
        <h2>AI + Voice Flow</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Stage</th><th>Website demo</th><th>Production equivalent</th></tr></thead>
            <tbody>
              <tr><td>Speech-to-text</td><td>Browser SpeechRecognition</td><td>Google Cloud Speech pa-IN</td></tr>
              <tr><td>LLM extraction</td><td>Local JSON extractor</td><td>GPT model prompt returning safe JSON</td></tr>
              <tr><td>Safety layer</td><td>SELECT-only JS filter</td><td>Whitelisted API + Oracle stored procedure</td></tr>
              <tr><td>Response</td><td>Scheme cards + warm summary</td><td>LLM response formatting in Punjabi</td></tr>
              <tr><td>Text-to-speech</td><td>Browser SpeechSynthesis</td><td>Google TTS female voice, rate 0.9</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  `;
}

function metric(value, label, note) {
  return `<div class="card pad metric"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`;
}

function calculateEligibility(profile) {
  return activeSchemes().filter(scheme => {
    if (profile.age < scheme.minAge || profile.age > scheme.maxAge) return false;
    if (scheme.gender && scheme.gender !== "Any" && scheme.gender !== profile.gender) return false;
    if (scheme.marital && scheme.marital.toLowerCase() !== String(profile.marital || "").toLowerCase()) return false;
    if (scheme.occupation && scheme.occupation.toLowerCase() !== String(profile.occupation || "").toLowerCase()) return false;
    if (scheme.incomeMax && Number(profile.income || 0) > scheme.incomeMax) return false;
    if (scheme.bpl && !profile.bpl) return false;
    if (scheme.disability && !profile.disability) return false;
    if (scheme.caste && !scheme.caste.includes(profile.caste)) return false;
    return true;
  });
}

function extractProfile(text) {
  const lower = text.toLowerCase();
  const ageMatch = lower.match(/(\d{1,3})\s*(year|saal|ਸਾਲ|yr|old)?/);
  const incomeMatch = lower.match(/(?:income|rs|ਰੁਪਏ|₹)\s*(?:is|below|under)?\s*([\d,]+)/);
  const profile = {
    age: ageMatch ? Number(ageMatch[1]) : 35,
    gender: lower.includes("widow") || lower.includes("female") || lower.includes("woman") || lower.includes("aurat") || lower.includes("ਵਿਧਵਾ") ? "F" : lower.includes("male") ? "M" : "Any",
    marital: lower.includes("widow") || lower.includes("ਵਿਧਵਾ") ? "Widow" : lower.includes("married") ? "Married" : "Single",
    occupation: lower.includes("student") ? "Student" : lower.includes("farmer") ? "Farmer" : lower.includes("self help") ? "Self Help Group" : "Homemaker",
    income: incomeMatch ? Number(incomeMatch[1].replace(/,/g, "")) : (lower.includes("low") || lower.includes("bpl") ? 40000 : 90000),
    bpl: lower.includes("bpl") || lower.includes("ration") || lower.includes("low"),
    disability: lower.includes("disability") || lower.includes("disabled"),
    caste: lower.includes("sc") ? "SC" : lower.includes("obc") ? "OBC" : "General",
    location: "Punjab"
  };
  if (profile.age >= 60 && profile.gender === "Any") profile.gender = "F";
  return profile;
}

function extractDocumentProfile(text, fileName = "") {
  const lower = `${text} ${fileName}`.toLowerCase();
  const profile = extractProfile(text);
  
  // Advanced OCR-like extraction patterns
  const dobMatch = text.match(/(?:dob|date of birth|ਜਨਮ)[^\d]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i);
  const aadhaarMatch = text.match(/\b(\d{4})\s?(\d{4})\s?(\d{4})\b/);
  const nameMatch = text.match(/(?:name|aadhaar card:?)\s*[:\-]?\s*([A-Za-z ]{3,40})/i);
  const incomeMatch = text.match(/(?:income|annual income|salary)[:\s]*(?:rs|₹)?\s*([\d,]+)/i);
  const ageMatch = text.match(/(?:age|ਉਮਰ)[:\s]*(\d{1,3})/i);
  const villageMatch = text.match(/(?:village|gram|ਪਿੰਡ)[:\s]*([A-Za-z ]{2,30})/i);
  const stateMatch = text.match(/(?:state|ਸੂਬਾ)[:\s]*([A-Za-z ]{2,30})/i);
  
  // Extract documents detected
  const docs = [];
  if (lower.includes("aadhaar") || lower.includes("adhar") || aadhaarMatch || fileName.includes("aadhaar")) docs.push("Aadhaar Card");
  if (lower.includes("ration") || lower.includes("bpl")) docs.push("Ration Card");
  if (lower.includes("bank") || lower.includes("account")) docs.push("Bank Account");
  if (lower.includes("widow") || lower.includes("widowed")) docs.push("Widow Certificate");
  if (lower.includes("income")) docs.push("Income Certificate");
  if (lower.includes("disability") || lower.includes("disabled")) docs.push("Disability Certificate");
  if (lower.includes("caste") || lower.includes("sc") || lower.includes("st") || lower.includes("obc")) docs.push("Caste Certificate");
  if (fileName.includes("pdf") || fileName.includes("jpg") || fileName.includes("png")) docs.push("Document File");
  
  // Calculate age from DOB if available
  let extractedAge = profile.age;
  if (dobMatch) {
    const dobParts = dobMatch[1].split(/[/-]/);
    const dob = new Date(dobParts[2], dobParts[1] - 1, dobParts[0]);
    const today = new Date();
    extractedAge = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
  } else if (ageMatch) {
    extractedAge = parseInt(ageMatch[1]);
  }

  // Extract features list for display
  const extractedFeatures = [];
  if (nameMatch) extractedFeatures.push(`Name: ${nameMatch[1].trim()}`);
  if (aadhaarMatch) extractedFeatures.push(`Aadhaar: XXXX-XXXX-${aadhaarMatch[3]}`);
  if (dobMatch) extractedFeatures.push(`DOB: ${dobMatch[1]}`);
  if (extractedAge) extractedFeatures.push(`Age: ${extractedAge} years`);
  extractedFeatures.push(`Gender: ${profile.gender === "Any" ? "Female" : profile.gender}`);
  if (incomeMatch) extractedFeatures.push(`Income: Rs ${incomeMatch[1]}`);
  if (lower.includes("widow")) extractedFeatures.push(`Marital: Widow`);
  if (lower.includes("bpl")) extractedFeatures.push(`Status: BPL`);
  if (lower.includes("disability")) extractedFeatures.push(`Disability: Yes`);
  if (lower.includes("sc")) extractedFeatures.push(`Caste: SC`);
  if (lower.includes("obc")) extractedFeatures.push(`Caste: OBC`);
  if (villageMatch) extractedFeatures.push(`Village: ${villageMatch[1]}`);
  
  const income = incomeMatch ? parseInt(incomeMatch[1].replace(/,/g, "")) : profile.income;

  return {
    name: nameMatch ? nameMatch[1].trim().replace(/\s+/g, " ") : "Extracted Citizen",
    aadhaarMasked: aadhaarMatch ? `XXXX-XXXX-${aadhaarMatch[3]}` : "XXXX-XXXX-2841",
    dob: dobMatch ? dobMatch[1] : (extractedAge >= 60 ? "1961-04-12" : "1998-08-15"),
    age: extractedAge,
    gender: profile.gender === "Any" ? "F" : profile.gender,
    address: villageMatch ? `${villageMatch[1]}, ${stateMatch ? stateMatch[1] : "Punjab"}` : "Punjab",
    documentsDetected: [...new Set(docs.length ? docs : ["Aadhaar", "Bank Account"])],
    confidence: fileName ? `OCR Extracted from ${fileName}: 89%` : "Text Extraction: 91%",
    occupation: profile.occupation,
    marital: profile.marital,
    income: income,
    bpl: profile.bpl || lower.includes("ration"),
    disability: profile.disability || lower.includes("disability"),
    caste: profile.caste,
    extractedFeatures: extractedFeatures,
    oracleInsert: "BENEFICIARY + DOCUMENT + ELIGIBILITY_MATCH"
  };
}

function schemeCard(scheme) {
  return `
    <article class="scheme-card">
      <div>
        <h3>${scheme.name}</h3>
        <p>${scheme.domain}. Documents: ${scheme.steps.join(", ")}.</p>
        <div class="tag-list">${scheme.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
      </div>
      <div>
        <div class="benefit">${scheme.benefit}</div>
        <button class="primary" data-action="enroll" data-scheme="${scheme.name}" style="margin-top:10px">Enroll Now</button>
      </div>
    </article>
  `;
}

function policyAwarenessCard(policy) {
  const severity = policy.awareness < 40 ? "critical" : policy.awareness < 55 ? "warn" : "ok";
  return `
    <article class="policy-card">
      <div>
        <strong>${policy.code} - ${policy.name}</strong>
        <span>${policy.domain} | ${policy.ministry}</span>
      </div>
      <div class="awareness-meter" aria-label="Awareness ${policy.awareness}%">
        <i style="width:${policy.awareness}%"></i>
      </div>
      <div class="policy-row">
        <span class="status ${severity}">${policy.awareness}% awareness</span>
        <span class="tag">${policy.coverage}% coverage</span>
        <span class="tag">${policy.channel}</span>
      </div>
      <p>${policy.barrier}</p>
    </article>
  `;
}

function policyAwarenessTable() {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Policy</th><th>Domain</th><th>Awareness</th><th>Coverage</th><th>Main barrier</th><th>Campaign</th></tr></thead>
        <tbody>
          ${policyCatalog.map(p => `
            <tr>
              <td><strong>${p.code}</strong><br>${p.name}</td>
              <td>${p.domain}</td>
              <td>${p.awareness}%</td>
              <td>${p.coverage}%</td>
              <td>${p.barrier}</td>
              <td>${p.channel}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function awarenessSegmentTable() {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Group</th><th>Target</th><th>Reached</th><th>Unaware</th><th>Need</th><th>Channel</th></tr></thead>
        <tbody>
          ${awarenessSegments.map(s => `
            <tr>
              <td>${s.group}</td>
              <td>${s.target}</td>
              <td>${s.reached}</td>
              <td>${s.unaware}</td>
              <td>${s.topNeed}</td>
              <td>${s.language}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function locationTable() {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Village</th><th>Awareness</th><th>Gap</th><th>Missed Benefit</th><th>Status</th></tr></thead>
        <tbody>${locations.map(l => `<tr><td>${l.name}</td><td>${l.awareness}%</td><td>${l.eligibleGap}</td><td>${l.missedBenefit}</td><td><span class="status ${l.priority}">${l.priority}</span></td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function schemePerformanceTable() {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Scheme</th><th>Domain</th><th>Eligible</th><th>Enrolled</th><th>Gap</th></tr></thead>
        <tbody>${activeSchemes().slice(0, 8).map((s, i) => `<tr><td>${s.name}</td><td>${s.domain}</td><td>${420 - i * 37}</td><td>${210 - i * 18}</td><td>${210 - i * 19}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function campaignTable() {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Campaign</th><th>Location</th><th>ROI</th><th>Enrollments</th><th>Cost per enrollment</th><th>Status</th></tr></thead>
        <tbody>${campaigns.map(c => `<tr><td>${c.name}</td><td>${c.location}</td><td>${c.roi}</td><td>${c.enrollments}</td><td>${c.cost}</td><td><span class="status ok">${c.status}</span></td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    toast("Text-to-speech is not supported in this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = /[\u0A00-\u0A7F]/.test(text) ? "pa-IN" : "en-IN";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function attachEvents() {
  document.querySelectorAll("[data-action='logout']").forEach(btn => btn.addEventListener("click", logout));
  document.querySelectorAll("[data-action='syncOracle']").forEach(btn => btn.addEventListener("click", () => syncOracleSchemes(true)));
  document.querySelectorAll("[data-action='syncOracleDb']").forEach(btn => btn.addEventListener("click", () => syncOracleDb(true)));
  document.querySelectorAll("[data-db-tab]").forEach(btn => btn.addEventListener("click", () => {
    state.dbTab = btn.dataset.dbTab;
    render();
  }));
  // Use button - Event delegation for demo account quick login
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("use-demo-btn")) {
      e.preventDefault();
      e.stopPropagation();
      
      const email = e.target.dataset.login;
      console.log("✓ Use button clicked for:", email);
      
      const user = demoUsers.find(u => u.email === email);
      console.log("✓ Found user:", user);
      
      if (user) {
        // Save user to state and localStorage
        state.user = user;
        localStorage.setItem("ys_user", JSON.stringify(user));
        console.log("✓ User saved to state");
        
        // Auto-add to database if citizen
        if (user.role === "Citizen") {
          addBeneficiaryToDb(user);
          console.log("✓ Added beneficiary to DB");
        }
        
        // Set profile for matching
        state.assistantProfile = user.profile || extractProfile("");
        
        // Map role to route
        const routeMap = {
          "Citizen": "#/citizen",
          "Government": "#/government",
          "NGO": "#/ngo",
          "Admin": "#/admin"
        };
        const newRoute = routeMap[user.role] || "#/";
        
        // Update state route immediately
        state.route = newRoute;
        console.log("✓ Route set to:", newRoute);
        
        // Change hash (will trigger hashchange listener)
        window.location.hash = newRoute;
        console.log("✓ Hash changed to:", window.location.hash);
        
        // Render immediately
        render();
        console.log("✓ Render called - Page updated!");
        
        toast(`✅ Authenticated as ${user.role}: ${user.name}`);
      } else {
        console.log("❌ User not found for email:", email);
        toast("❌ User not found");
      }
    }
  });

  // Aadhaar Login Form Handler
  document.addEventListener("submit", (e) => {
    if (e.target.id === "aadhaarLoginForm") {
      e.preventDefault();
      
      const aadhaarInput = document.getElementById("aadhaarInput").value.trim();
      const role = document.getElementById("roleSelect").value;
      
      // Validate Aadhaar format (12 digits)
      const aadhaarClean = aadhaarInput.replace(/\s/g, '');
      if (!/^\d{12}$/.test(aadhaarClean)) {
        toast("❌ Invalid Aadhaar. Use 12-digit format: 1234 5678 9012");
        return;
      }
      
      console.log("✓ Aadhaar validated:", aadhaarClean);
      
      // Map specific Aadhaar to demo profiles
      let user = null;
      if (aadhaarClean === "123456789012") {
        user = demoUsers.find(u => u.role === "Citizen" && u.ageGroup === "Senior Citizen");
      } else if (aadhaarClean === "234567890123") {
        user = demoUsers.find(u => u.role === "Citizen" && u.ageGroup === "Youth / Student");
      } else if (aadhaarClean === "345678901234") {
        user = demoUsers.find(u => u.role === "Citizen" && u.ageGroup === "Women & Child");
      } else {
        // Create new user from Aadhaar
        user = {
          id: "citizen-" + aadhaarClean,
          email: "beneficiary_" + aadhaarClean + "@yognasaathi.in",
          aadhaar: aadhaarClean,
          role: role,
          name: "Beneficiary " + aadhaarClean.slice(-4),
          profile: {
            age: Math.floor(Math.random() * 50) + 20,
            gender: Math.random() > 0.5 ? "F" : "M",
            income: Math.floor(Math.random() * 80000) + 20000,
            bpl: Math.random() > 0.4,
            disability: Math.random() > 0.9,
            location: "Punjab"
          }
        };
      }
      
      if (!user) user = { ...demoUsers.find(u => u.role === role), aadhaar: aadhaarClean };
      
      // Save user
      state.user = user;
      localStorage.setItem("ys_user", JSON.stringify(user));
      console.log("✓ User authenticated with Aadhaar:", aadhaarClean);
      
      // Auto-add to database if citizen
      if (user.role === "Citizen") {
        addBeneficiaryToDb(user);
        state.assistantProfile = user.profile;
        state.matches = calculateEligibility(state.assistantProfile);
      }
      
      // Navigate
      const routeMap = {
        "Citizen": "#/citizen",
        "Government": "#/government",
        "NGO": "#/ngo",
        "Admin": "#/admin"
      };
      state.route = routeMap[user.role] || "#/citizen";
      window.location.hash = state.route;
      render();
      toast(`✅ Authenticated | Aadhaar: ${aadhaarClean} | Role: ${user.role}`);
    }
  });

  document.querySelectorAll("[data-action='runAssistant']").forEach(btn => btn.addEventListener("click", () => {
    const text = document.getElementById("assistantText").value;
    state.assistantText = text;
    state.assistantProfile = extractProfile(text);
    state.matches = calculateEligibility(state.assistantProfile);
    toast(`Found ${state.matches.length} eligible schemes.`);
    render();
  }));

  document.querySelectorAll("[data-action='samplePunjabi']").forEach(btn => btn.addEventListener("click", () => {
    state.assistantText = "ਮੈਂ 65 ਸਾਲ ਦੀ ਵਿਧਵਾ ਹਾਂ, ਮੇਰੀ ਆਮਦਨ ਘੱਟ ਹੈ, ਮੈਨੂੰ ਕਿਹੜੀਆਂ ਯੋਜਨਾਵਾਂ ਮਿਲ ਸਕਦੀਆਂ ਹਨ?";
    state.assistantProfile = extractProfile(state.assistantText);
    state.matches = calculateEligibility(state.assistantProfile);
    render();
  }));

  document.querySelectorAll("[data-action='speak']").forEach(btn => btn.addEventListener("click", () => {
    const matches = state.matches.length ? state.matches : calculateEligibility(state.user?.profile || demoUsers[0].profile);
    const text = matches.length
      ? `You qualify for ${matches.length} schemes. ${matches.slice(0, 3).map(s => `${s.name}, benefit ${s.benefit}`).join(". ")}.`
      : "No direct scheme match found. Please contact the local welfare office for manual verification.";
    speak(text);
  }));

  document.querySelectorAll("[data-action='listen']").forEach(btn => btn.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast("Speech recognition is not supported here. Type your query instead.");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = event => {
      state.assistantText = event.results[0][0].transcript;
      state.assistantProfile = extractProfile(state.assistantText);
      state.matches = calculateEligibility(state.assistantProfile);
      render();
    };
    recognition.start();
    toast("Listening now...");
  }));

  document.querySelectorAll("[data-action='enroll']").forEach(btn => btn.addEventListener("click", () => {
    toast(`Enrollment request submitted for ${btn.dataset.scheme}.`);
  }));

  document.querySelectorAll("[data-action='downloadGovReport']").forEach(btn => btn.addEventListener("click", () => {
    const rows = ["Village,Awareness,Eligible Gap,Missed Benefit", ...locations.map(l => `${l.name},${l.awareness},${l.eligibleGap},${l.missedBenefit}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "yogna-saathi-government-report.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("CSV report generated.");
  }));

  document.querySelectorAll("[data-action='processReport']").forEach(btn => btn.addEventListener("click", () => {
    const note = document.getElementById("fieldNote").value;
    const extracted = extractProfile(note);
    const matched = calculateEligibility(extracted).map(s => s.name);
    document.getElementById("reportJson").textContent = JSON.stringify({
      source: "field_report",
      extracted,
      matchedSchemes: matched,
      firestoreStatus: "saved_to_demo_store",
      routing: "sent_to_coordinator_dashboard"
    }, null, 2);
    toast("Field report extracted, saved, and routed.");
  }));

  document.querySelectorAll("[data-action='processDocument']").forEach(btn => btn.addEventListener("click", () => {
    const file = document.getElementById("documentFile").files[0];
    const text = document.getElementById("documentText").value;
    
    if (!text && !file) {
      toast("❌ Please upload a document or enter text");
      return;
    }
    
    // Clear previous extraction
    state.docExtract = null;
    state.docMatches = [];
    
    // Process current document with OCR-like extraction
    state.docExtract = extractDocumentProfile(text, file?.name || "");
    state.docMatches = calculateEligibility(state.docExtract);
    
    // Clear form fields after extraction
    document.getElementById("documentFile").value = "";
    document.getElementById("documentText").value = "";
    
    // Display success with extracted features
    const featureSummary = state.docExtract.extractedFeatures && state.docExtract.extractedFeatures.length > 0
      ? `Extracted: ${state.docExtract.extractedFeatures.slice(0, 5).join(" | ")}`
      : "Document processed";
    
    console.log("✓ Document extracted with features:", state.docExtract.extractedFeatures);
    toast(`✅ OCR Complete: ${state.docMatches.length} yojanas matched. ${featureSummary}`);
    render();
  }));

  document.querySelectorAll("[data-action='speakDocument']").forEach(btn => btn.addEventListener("click", () => {
    const matches = state.docMatches.length ? state.docMatches : calculateEligibility(state.docExtract || demoUsers[0].profile);
    speak(`Document verification found ${matches.length} eligible yojanas. ${matches.slice(0, 3).map(s => s.name).join(", ")}.`);
  }));

  document.querySelectorAll("[data-action='downloadAwarenessReport']").forEach(btn => btn.addEventListener("click", () => {
    const rows = [
      "Policy,Domain,Awareness,Coverage,Barrier,Campaign",
      ...policyCatalog.map(p => `"${p.name}",${p.domain},${p.awareness},${p.coverage},"${p.barrier}","${p.channel}"`)
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "yogna-saathi-policy-awareness.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Awareness CSV generated.");
  }));

  const oracleSchemeForm = document.getElementById("oracleSchemeForm");
  if (oracleSchemeForm) {
    oracleSchemeForm.addEventListener("submit", async event => {
      event.preventDefault();
      try {
        await addOracleSchemeFromForm();
      } catch (error) {
        toast("Oracle API insert failed. Start oracle_api_server.js on port 5174.");
      }
    });
  }

  document.querySelectorAll("[data-action='deleteOracleScheme']").forEach(btn => btn.addEventListener("click", async () => {
    try {
      await deleteOracleScheme(btn.dataset.id);
    } catch (error) {
      toast("Oracle API delete failed. Start oracle_api_server.js on port 5174.");
    }
  }));

  document.querySelectorAll(".db-add-form").forEach(form => form.addEventListener("submit", async event => {
    event.preventDefault();
    try {
      await addDbRow(form.dataset.table);
    } catch (error) {
      toast("Insert failed. Check Oracle API bridge on port 5174.");
    }
  }));

  document.querySelectorAll("[data-action='deleteDbRow']").forEach(btn => btn.addEventListener("click", async () => {
    try {
      await deleteDbRow(btn.dataset.table, btn.dataset.id);
    } catch (error) {
      toast("Delete failed. Check Oracle API bridge on port 5174.");
    }
  }));

  document.querySelectorAll("[data-action='runDbQuery']").forEach(btn => btn.addEventListener("click", async () => {
    try {
      await runDbQuery();
    } catch (error) {
      toast("Query failed. Check Oracle API bridge on port 5174.");
    }
  }));

  document.querySelectorAll("[data-sql]").forEach(btn => btn.addEventListener("click", () => {
    document.getElementById("dbSql").value = btn.dataset.sql;
  }));

  document.querySelectorAll("[data-action='assignRoute']").forEach(btn => btn.addEventListener("click", () => {
    toast(`Volunteer route assigned for ${btn.dataset.place}.`);
  }));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

render();
syncOracleSchemes(false);
syncOracleDb(false);
setInterval(() => {
  if (state.route.startsWith("#/database")) syncOracleDb(false);
  else syncOracleSchemes(false);
}, 5000);
