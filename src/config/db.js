const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  port:     parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME     || "course_management",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit: 10,
  idleTimeoutMillis: 30000,
  connectTimeout: 2000,
});

const connectDB = async () => {
  const conn = await pool.getConnection();
  conn.release();
};

const query = async (sql, params = []) => {
  const sanitized = params.map(p => {
    if (p === undefined || p === null) return null;
    if (typeof p === 'number') return p;           // keep numbers as-is
    if (!isNaN(p) && p !== '') return Number(p);   // coerce numeric strings
    return p;
  });

  // Use pool.query() instead of pool.execute()
  // execute() uses prepared statements which are strict about LIMIT/OFFSET types
  const [result] = await pool.query(sql, sanitized);

  return {
    rows: Array.isArray(result) ? result : [],
    insertId: result.insertId || null,
    affectedRows: result.affectedRows || 0,
  };
};

module.exports = { query, connectDB, pool };