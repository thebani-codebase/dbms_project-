// Production replacement for oracle_api_server.js
// This shows exactly where Oracle 21c connects in the real project.

import express from "express";
import oracledb from "oracledb";

const app = express();
app.use(express.json());

const pool = await oracledb.createPool({
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
  poolMin: 2,
  poolMax: 10
});

app.get("/api/oracle/schemes", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const result = await connection.execute(`
      SELECT ps.scheme_id,
             ps.scheme_name,
             sd.domain_name,
             ps.max_annual_benefit,
             ps.status
      FROM policy_scheme ps
      JOIN scheme_domain sd ON sd.domain_id = ps.domain_id
      WHERE ps.status = 'Active'
      ORDER BY ps.scheme_name
    `);
    res.json({ success: true, source: "Oracle 21c", schemes: result.rows });
  } finally {
    await connection.close();
  }
});

app.post("/api/oracle/schemes", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      `INSERT INTO policy_scheme
        (scheme_id, scheme_code, scheme_name, domain_id, max_annual_benefit, status)
       VALUES
        (seq_scheme_id.NEXTVAL, :code, :name, :domainId, :benefit, 'Active')`,
      req.body,
      { autoCommit: true }
    );
    res.status(201).json({ success: true });
  } finally {
    await connection.close();
  }
});

app.delete("/api/oracle/schemes/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      `UPDATE policy_scheme SET status = 'Inactive' WHERE scheme_id = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );
    res.json({ success: true });
  } finally {
    await connection.close();
  }
});

app.listen(3000);
