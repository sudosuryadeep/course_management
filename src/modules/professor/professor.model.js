const { query } = require("../../config/db");

const ProfessorModel = {
  async findAll({ limit = 20, offset = 0, search = "", department_id = null } = {}) {
    let sql = `
      SELECT 
        p.*,
        d.name AS department_name,
        d.building AS department_building,
        COUNT(DISTINCT c.id) AS course_count
      FROM professors p
      LEFT JOIN departments d ON d.id = p.department_id
      LEFT JOIN courses c ON c.professor_id = p.id
      WHERE p.name LIKE ?
    `;

    const params = [`%${search}%`];

    // ✅ add condition ONLY if exists
    if (department_id) {
      sql += ` AND p.department_id = ?`;
      params.push(department_id);
    }

    sql += `
      GROUP BY p.id
      ORDER BY p.name
      LIMIT ? OFFSET ?
    `;

    params.push(Number(limit), Number(offset));

    const { rows } = await query(sql, params);
    return rows;
  },

  async count(search = "", department_id = null) {
    let sql = `SELECT COUNT(*) AS count FROM professors WHERE name LIKE ?`;
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
      `SELECT 
        p.*,
        d.name AS department_name,
        d.building AS department_building
      FROM professors p
      LEFT JOIN departments d ON d.id = p.department_id
      WHERE p.id = ?`,
      [id]
    );

    if (!rows[0]) return null;

    // get courses separately (since MySQL doesn't support JSON_AGG like PG)
    const { rows: courses } = await query(
      `SELECT id, name, credits
       FROM courses
       WHERE professor_id = ?
       ORDER BY name`,
      [id]
    );

    return {
      ...rows[0],
      courses,
    };
  },

  async create({ name, department_id }) {
    const result = await query(
  `INSERT INTO professors (name, department_id) VALUES (?, ?)`,
  [name, department_id]
);

return { id: result.insertId, name, department_id };
  },

  async update(id, { name, department_id }) {
    await query(
      `UPDATE professors
       SET name = COALESCE(?, name),
           department_id = COALESCE(?, department_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, department_id, id]
    );

    return this.findById(id);
  },

  async delete(id) {
  // pehle courses ka professor_id null karo
  await query(`UPDATE courses SET professor_id = NULL WHERE professor_id = ?`, [id]);
  // phir professor delete karo
  await query(`DELETE FROM professors WHERE id = ?`, [id]);
  return { id };
},
};

module.exports = ProfessorModel;