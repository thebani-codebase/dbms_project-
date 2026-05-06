const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5174;
const DB_FILE = path.join(__dirname, "oracle_mock_db.json");

const initialDb = {
  version: 1,
  updatedAt: new Date().toISOString(),
  schemes: [
    { id: 1, name: "Indira Gandhi National Widow Pension", domain: "Social Security", benefit: "Rs 18,000/year", minAge: 40, maxAge: 120, gender: "F", marital: "Widow", incomeMax: 100000, tags: ["widow", "senior", "women"], steps: ["Aadhaar", "Bank account", "Widow certificate", "Income certificate"] },
    { id: 2, name: "Old Age Pension Scheme", domain: "Senior Citizen", benefit: "Rs 12,000/year", minAge: 60, maxAge: 120, gender: "Any", incomeMax: 120000, tags: ["senior", "pension"], steps: ["Aadhaar", "Age proof", "Bank account", "Residence proof"] },
    { id: 3, name: "Ayushman Bharat PM-JAY", domain: "Healthcare", benefit: "Rs 5,00,000 cover", minAge: 0, maxAge: 120, gender: "Any", incomeMax: 150000, bpl: true, tags: ["health", "bpl", "family"], steps: ["Aadhaar", "Ration card", "Family ID"] },
    { id: 4, name: "PM-KISAN Samman Nidhi", domain: "Agriculture", benefit: "Rs 6,000/year", minAge: 18, maxAge: 120, gender: "Any", occupation: "Farmer", tags: ["farmer", "land"], steps: ["Land record", "Aadhaar", "Bank account"] },
    { id: 5, name: "Post Matric Scholarship", domain: "Education", benefit: "Tuition + stipend", minAge: 16, maxAge: 28, gender: "Any", occupation: "Student", caste: ["SC", "OBC"], incomeMax: 250000, tags: ["student", "scholarship", "youth"], steps: ["Caste certificate", "Income certificate", "Marksheets", "Bank account"] },
    { id: 6, name: "Ujjwala Yojana", domain: "Women & Child", benefit: "Free LPG connection", minAge: 18, maxAge: 120, gender: "F", incomeMax: 150000, bpl: true, tags: ["women", "bpl", "lpg"], steps: ["Aadhaar", "Ration card", "Bank account"] }
  ],
  beneficiaries: [
    { id: 101, name: "Gurmeet Kaur", age: 65, gender: "F", marital: "Widow", income: 36000, bpl: true, location: "Khera", documents: ["Aadhaar", "Ration Card", "Widow Certificate"] },
    { id: 102, name: "Aman Singh", age: 19, gender: "M", marital: "Single", income: 0, bpl: true, location: "Ludhiana", documents: ["Aadhaar", "Caste Certificate", "Marksheets"] },
    { id: 103, name: "Meena Devi", age: 28, gender: "F", marital: "Married", income: 65000, bpl: true, location: "Patiala", documents: ["Aadhaar", "Ration Card", "Bank Account"] }
  ],
  enrollments: [
    { id: 9001, beneficiaryId: 101, schemeId: 2, status: "Active", annualBenefit: 12000 },
    { id: 9002, beneficiaryId: 103, schemeId: 6, status: "Applied", annualBenefit: 0 }
  ],
  auditLog: [
    { id: 1, table: "POLICY_SCHEME", operation: "SEED", recordId: 1, message: "Initial Oracle mock data loaded", at: new Date().toISOString() }
  ],
  queryHistory: []
};

function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
  }
  const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  let changed = false;
  for (const [key, value] of Object.entries(initialDb)) {
    if (db[key] === undefined) {
      db[key] = value;
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  return db;
}

function writeDb(db, audit) {
  if (audit) {
    const nextAuditId = Math.max(0, ...db.auditLog.map(row => Number(row.id))) + 1;
    db.auditLog.unshift({ id: nextAuditId, at: new Date().toISOString(), ...audit });
  }
  db.version += 1;
  db.updatedAt = new Date().toISOString();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function tableConfig(table) {
  const map = {
    schemes: { oracleName: "POLICY_SCHEME", idField: "id" },
    beneficiaries: { oracleName: "BENEFICIARY", idField: "id" },
    enrollments: { oracleName: "BENEFICIARY_ENROLLMENT", idField: "id" }
  };
  return map[table];
}

function normalizeRow(table, body, db) {
  if (table === "schemes") {
    const nextId = Math.max(0, ...db.schemes.map(s => Number(s.id))) + 1;
    return {
      id: nextId,
      name: body.name || "New Oracle Scheme",
      domain: body.domain || "Social Security",
      benefit: body.benefit || "Rs 10,000/year",
      minAge: Number(body.minAge || 0),
      maxAge: Number(body.maxAge || 120),
      gender: body.gender || "Any",
      incomeMax: body.incomeMax ? Number(body.incomeMax) : undefined,
      bpl: Boolean(body.bpl),
      tags: String(body.tags || "oracle,live").split(",").map(t => t.trim()).filter(Boolean),
      steps: String(body.steps || "Aadhaar,Bank account").split(",").map(t => t.trim()).filter(Boolean)
    };
  }
  if (table === "beneficiaries") {
    const nextId = Math.max(100, ...db.beneficiaries.map(b => Number(b.id))) + 1;
    return {
      id: nextId,
      name: body.name || "New Beneficiary",
      age: Number(body.age || 35),
      gender: body.gender || "F",
      marital: body.marital || "Single",
      income: Number(body.income || 80000),
      bpl: Boolean(body.bpl),
      location: body.location || "Punjab",
      documents: String(body.documents || "Aadhaar,Bank Account").split(",").map(t => t.trim()).filter(Boolean)
    };
  }
  if (table === "enrollments") {
    const nextId = Math.max(9000, ...db.enrollments.map(e => Number(e.id))) + 1;
    return {
      id: nextId,
      beneficiaryId: Number(body.beneficiaryId || 101),
      schemeId: Number(body.schemeId || 1),
      status: body.status || "Applied",
      annualBenefit: Number(body.annualBenefit || 0)
    };
  }
  return body;
}

function runDemoQuery(db, sql) {
  const normalized = sql.trim().toLowerCase();
  let rows = [];
  let message = "Query executed";

  if (normalized.includes("count")) {
    rows = [{
      policy_scheme: db.schemes.length,
      beneficiary: db.beneficiaries.length,
      beneficiary_enrollment: db.enrollments.length,
      audit_log: db.auditLog.length
    }];
    message = "Aggregate COUNT query executed";
  } else if (normalized.includes("policy_scheme")) {
    rows = db.schemes;
    message = "SELECT returned POLICY_SCHEME rows";
  } else if (normalized.includes("beneficiary_enrollment")) {
    rows = db.enrollments;
    message = "SELECT returned BENEFICIARY_ENROLLMENT rows";
  } else if (normalized.includes("beneficiary")) {
    rows = db.beneficiaries;
    message = "SELECT returned BENEFICIARY rows";
  } else if (normalized.includes("audit_log")) {
    rows = db.auditLog;
    message = "SELECT returned AUDIT_LOG rows";
  } else if (normalized.includes("calculate_beneficiary_eligibility")) {
    rows = db.beneficiaries.map(beneficiary => ({
      beneficiary: beneficiary.name,
      eligibleSchemes: db.schemes.filter(scheme => beneficiary.age >= scheme.minAge && beneficiary.age <= scheme.maxAge).length
    }));
    message = "PL/SQL procedure calculate_beneficiary_eligibility simulated";
  } else {
    rows = [{ notice: "Demo query runner supports SELECT from POLICY_SCHEME, BENEFICIARY, BENEFICIARY_ENROLLMENT, AUDIT_LOG and procedure simulation." }];
  }

  const nextQueryId = Math.max(0, ...db.queryHistory.map(row => Number(row.id))) + 1;
  db.queryHistory.unshift({ id: nextQueryId, sql, message, rows: rows.length, at: new Date().toISOString() });
  writeDb(db, { table: "QUERY_HISTORY", operation: "QUERY", recordId: nextQueryId, message });
  return { rows, message };
}

function send(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", chunk => data += chunk);
    req.on("end", () => resolve(data ? JSON.parse(data) : {}));
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 200, { ok: true });

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const db = readDb();

  if (req.method === "GET" && url.pathname === "/health") {
    return send(res, 200, { ok: true, service: "Yogna Saathi Oracle API Bridge", source: "oracle_mock_db.json", version: db.version });
  }

  if (req.method === "GET" && url.pathname === "/api/oracle/schemes") {
    return send(res, 200, { success: true, source: "Oracle API Bridge", version: db.version, updatedAt: db.updatedAt, schemes: db.schemes });
  }

  if (req.method === "GET" && url.pathname === "/api/oracle/db") {
    return send(res, 200, { success: true, source: "Oracle API Bridge", version: db.version, updatedAt: db.updatedAt, db });
  }

  if (req.method === "POST" && url.pathname === "/api/oracle/schemes") {
    const body = await readBody(req);
    const nextId = Math.max(0, ...db.schemes.map(s => Number(s.id))) + 1;
    const scheme = {
      id: nextId,
      name: body.name || "New Oracle Scheme",
      domain: body.domain || "Social Security",
      benefit: body.benefit || "Rs 10,000/year",
      minAge: Number(body.minAge || 0),
      maxAge: Number(body.maxAge || 120),
      gender: body.gender || "Any",
      incomeMax: body.incomeMax ? Number(body.incomeMax) : undefined,
      bpl: Boolean(body.bpl),
      tags: String(body.tags || "oracle,live").split(",").map(t => t.trim()).filter(Boolean),
      steps: String(body.steps || "Aadhaar,Bank account").split(",").map(t => t.trim()).filter(Boolean)
    };
    db.schemes.push(scheme);
    writeDb(db, { table: "POLICY_SCHEME", operation: "INSERT", recordId: scheme.id, message: `Inserted ${scheme.name}; trigger updated audit log.` });
    return send(res, 201, { success: true, message: "Scheme inserted into Oracle mock database", scheme, version: db.version });
  }

  if (req.method === "POST" && url.pathname.startsWith("/api/oracle/table/")) {
    const table = url.pathname.split("/").pop();
    const config = tableConfig(table);
    if (!config) return send(res, 400, { success: false, message: "Unsupported table" });
    const body = await readBody(req);
    const row = normalizeRow(table, body, db);
    db[table].push(row);
    writeDb(db, { table: config.oracleName, operation: "INSERT", recordId: row.id, message: `${config.oracleName} trigger fired after INSERT` });
    return send(res, 201, { success: true, row, version: db.version });
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/api/oracle/schemes/")) {
    const id = Number(url.pathname.split("/").pop());
    const before = db.schemes.length;
    db.schemes = db.schemes.filter(s => Number(s.id) !== id);
    if (db.schemes.length === before) return send(res, 404, { success: false, message: "Scheme not found" });
    writeDb(db, { table: "POLICY_SCHEME", operation: "DELETE", recordId: id, message: `Deleted scheme ${id}; trigger updated audit log.` });
    return send(res, 200, { success: true, message: "Scheme deleted from Oracle mock database", version: db.version });
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/api/oracle/table/")) {
    const parts = url.pathname.split("/");
    const id = Number(parts.pop());
    const table = parts.pop();
    const config = tableConfig(table);
    if (!config) return send(res, 400, { success: false, message: "Unsupported table" });
    const before = db[table].length;
    db[table] = db[table].filter(row => Number(row.id) !== id);
    if (db[table].length === before) return send(res, 404, { success: false, message: "Row not found" });
    writeDb(db, { table: config.oracleName, operation: "DELETE", recordId: id, message: `${config.oracleName} trigger fired after DELETE` });
    return send(res, 200, { success: true, version: db.version });
  }

  if (req.method === "POST" && url.pathname === "/api/oracle/query") {
    const body = await readBody(req);
    const result = runDemoQuery(db, body.sql || "SELECT COUNT(*) FROM POLICY_SCHEME");
    return send(res, 200, { success: true, version: readDb().version, ...result });
  }

  return send(res, 404, { success: false, message: "Route not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Yogna Saathi Oracle API Bridge running at http://127.0.0.1:${PORT}`);
});
