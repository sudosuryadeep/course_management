// src/modules/enrollment/enrollment.model.js
const { query } = require("../../config/db");

const EnrollmentModel = {
  async findAll({ limit = 20, offset = 0 } = {}) {
    const { rows } = await query(
      `SELECT e.*,
              s.name   AS student_name,
              c.name   AS course_name,
              sem.name AS semester_name
       FROM enrollments e
       JOIN students  s   ON e.student_id  = s.id
       JOIN courses   c   ON e.course_id   = c.id
       JOIN semesters sem ON e.semester_id = sem.id
       ORDER BY e.id
       LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
    );
    return rows;
  },

  async count() {
    const { rows } = await query(`SELECT COUNT(*) AS count FROM enrollments`);
    return rows[0].count;
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT e.*,
              s.name   AS student_name,
              c.name   AS course_name,
              sem.name AS semester_name
       FROM enrollments e
       JOIN students  s   ON e.student_id  = s.id
       JOIN courses   c   ON e.course_id   = c.id
       JOIN semesters sem ON e.semester_id = sem.id
       WHERE e.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findDuplicate(student_id, course_id, semester_id) {
    const { rows } = await query(
      `SELECT id FROM enrollments
       WHERE student_id = ? AND course_id = ? AND semester_id = ?`,
      [student_id, course_id, semester_id]
    );
    return rows[0] || null;
  },

  async create({ student_id, course_id, semester_id }) {
    const result = await query(
      `INSERT INTO enrollments (student_id, course_id, semester_id) VALUES (?, ?, ?)`,
      [student_id, course_id, semester_id]
    );
    return { id: result.insertId, student_id, course_id, semester_id };
  },

  async update(id, { student_id, course_id, semester_id }) {
    await query(
      `UPDATE enrollments
       SET student_id = COALESCE(?, student_id),
           course_id = COALESCE(?, course_id),
           semester_id = COALESCE(?, semester_id),
           updated_at = NOW()
       WHERE id = ?`,
      [student_id ?? null, course_id ?? null, semester_id ?? null, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    const enrollment = await this.findById(id);
    await query(`DELETE FROM enrollments WHERE id = ?`, [id]);
    return enrollment;
  },

  async findByStudent(student_id) {
    const { rows } = await query(
      `SELECT e.*,
              c.name   AS course_name,
              c.credits,
              sem.name AS semester_name,
              p.name   AS professor_name
       FROM enrollments e
       JOIN courses   c   ON e.course_id   = c.id
       JOIN semesters sem ON e.semester_id = sem.id
       LEFT JOIN professors p ON c.professor_id = p.id
       WHERE e.student_id = ?
       ORDER BY sem.name, c.name`,
      [student_id]
    );
    return rows;
  },

  async findByCourse(course_id) {
    const { rows } = await query(
      `SELECT e.*,
              s.name   AS student_name,
              sem.name AS semester_name
       FROM enrollments e
       JOIN students  s   ON e.student_id  = s.id
       JOIN semesters sem ON e.semester_id = sem.id
       WHERE e.course_id = ?
       ORDER BY sem.name, s.name`,
      [course_id]
    );
    return rows;
  },

  async findBySemester(semester_id) {
    const { rows } = await query(
      `SELECT e.*,
              s.name AS student_name,
              c.name AS course_name
       FROM enrollments e
       JOIN students s ON e.student_id = s.id
       JOIN courses  c ON e.course_id  = c.id
       WHERE e.semester_id = ?
       ORDER BY c.name, s.name`,
      [semester_id]
    );
    return rows;
  },
};

module.exports = EnrollmentModel;