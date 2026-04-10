// src/modules/student/student.model.js
const { query } = require("../../config/db");

const StudentModel = {
  async findAll({ limit = 20, offset = 0, search = "", department_id = null } = {}) {
    let sql = `
      SELECT s.*, d.name AS department_name
      FROM students s
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE s.name LIKE ?
    `;
    const params = [`%${search}%`];

    if (department_id) {
      sql += ` AND s.department_id = ?`;
      params.push(department_id);
    }

    sql += ` ORDER BY s.name LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

    const { rows } = await query(sql, params);
    return rows;
  },

  async count(search = "", department_id = null) {
    let sql = `SELECT COUNT(*) AS count FROM students WHERE name LIKE ?`;
    const params = [`%${search}%`];

    if (department_id) {
      sql += ` AND department_id = ?`;
      params.push(department_id);
    }

    const { rows } = await query(sql, params);
    return rows[0].count;
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT s.*, d.name AS department_name
       FROM students s
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE s.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, image, department_id }) {
    const result = await query(
      `INSERT INTO students (name, image, department_id) VALUES (?, ?, ?)`,
      [name, image, department_id]
    );
    return { id: result.insertId, name, image, department_id };  // ✅ fixed
  },

  async update(id, { name, image, department_id }) {
    await query(
      `UPDATE students
       SET name = COALESCE(?, name),
           image = COALESCE(?, image),
           department_id = COALESCE(?, department_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, image, department_id, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    await query(`DELETE FROM students WHERE id = ?`, [id]);
    return { id };
  },

  async findByDepartment(department_id) {
    const { rows } = await query(
      `SELECT s.*, d.name AS department_name
       FROM students s
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE s.department_id = ?
       ORDER BY s.name`,
      [department_id]
    );
    return rows;
  },
};

module.exports = StudentModel;