// src/modules/department/department.model.js
const { query } = require("../../config/db");

const DepartmentModel = {
  async findAll({ limit = 20, offset = 0, search = "" } = {}) {
    const searchParam = `%${search}%`;

    const { rows } = await query(
      `SELECT d.*,
              COUNT(DISTINCT p.id) AS professor_count,
              COUNT(DISTINCT s.id) AS student_count,
              COUNT(DISTINCT c.id) AS course_count
       FROM departments d
       LEFT JOIN professors p ON p.department_id = d.id
       LEFT JOIN students   s ON s.department_id = d.id
       LEFT JOIN courses    c ON c.department_id = d.id
       WHERE d.name LIKE ? OR d.building LIKE ?
       GROUP BY d.id
       ORDER BY d.name
       LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
      [searchParam, searchParam]
    );

    return rows;
  },

  async count(search = "") {
    const { rows } = await query(
      `SELECT COUNT(*) AS count
       FROM departments
       WHERE name LIKE ? OR building LIKE ?`,
      [`%${search}%`, `%${search}%`]
    );

    return rows[0].count;
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT d.*,
              COUNT(DISTINCT p.id) AS professor_count,
              COUNT(DISTINCT s.id) AS student_count,
              COUNT(DISTINCT c.id) AS course_count
       FROM departments d
       LEFT JOIN professors p ON p.department_id = d.id
       LEFT JOIN students   s ON s.department_id = d.id
       LEFT JOIN courses    c ON c.department_id = d.id
       WHERE d.id = ?
       GROUP BY d.id`,
      [id]
    );

    return rows[0] || null;
  },

  async findByName(name) {
    const { rows } = await query(
      `SELECT * FROM departments WHERE LOWER(name) = LOWER(?)`,
      [name]
    );

    return rows[0] || null;
  },

  async create({ name, building }) {
    const result = await query(
      `INSERT INTO departments (name, building) VALUES (?, ?)`,
      [name, building]
    );

    return { id: result.insertId, name, building };
  },

  async update(id, { name, building }) {
    await query(
      `UPDATE departments
       SET name = ?, building = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, building, id]
    );

    return this.findById(id);
  },

  async delete(id) {
    const department = await this.findById(id);
    await query(`DELETE FROM departments WHERE id = ?`, [id]);
    return department;
  },
};

module.exports = DepartmentModel;