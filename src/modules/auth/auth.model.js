// src/modules/auth/auth.model.js
const { query } = require("../../config/db");

const AuthModel = {
  async findByEmail(email) {
    const { rows } = await query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, password, role = "student" }) {
    const result = await query(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      [name, email, password, role]
    );
    return { id: result.insertId, name, email, role };
  },
};

module.exports = AuthModel;