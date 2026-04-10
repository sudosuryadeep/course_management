const db = require("../../config/db");

const SemesterModel = {
  // Create a new semester
  async create({ name }) {
    const result = await db.query(
      `INSERT INTO semesters (name) VALUES (?)`,
      [name]
    );

    return { id: result.rows.insertId, name };
  },

  // Get all semesters
  async findAll() {
    const { rows } = await db.query(
      `SELECT * FROM semesters ORDER BY created_at DESC`
    );
    return rows;
  },

  // Get semester by ID
  async findById(id) {
    const { rows } = await db.query(
      `SELECT * FROM semesters WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Update semester
  async update(id, { name }) {
    await db.query(
      `UPDATE semesters
       SET name = COALESCE(?, name),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, id]
    );

    return this.findById(id);
  },

  // Delete semester
  async delete(id) {
    await db.query(`DELETE FROM semesters WHERE id = ?`, [id]);
    return { id };
  },

  // Get all enrollments under a semester
  async findEnrollments(semesterId) {
    const { rows } = await db.query(
      `SELECT 
         e.id AS enrollment_id,
         s.id AS student_id,
         s.name AS student_name,
         c.id AS course_id,
         c.name AS course_name,
         sem.name AS semester_name
       FROM enrollments e
       JOIN students s   ON s.id = e.student_id
       JOIN courses c    ON c.id = e.course_id
       JOIN semesters sem ON sem.id = e.semester_id
       WHERE e.semester_id = ?
       ORDER BY s.name`,
      [semesterId]
    );

    return rows;
  },
};

module.exports = SemesterModel;