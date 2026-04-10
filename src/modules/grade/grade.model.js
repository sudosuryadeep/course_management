const { query } = require("../../config/db");

const GradeModel = {

  async findAll() {
    return await query(`
      SELECT g.*,
             s.name   AS student_name,
             c.name   AS course_name,
             sem.name AS semester_name
      FROM grades g
      JOIN enrollments e   ON g.enrollment_id = e.id
      JOIN students    s   ON e.student_id     = s.id
      JOIN courses     c   ON e.course_id      = c.id
      JOIN semesters   sem ON e.semester_id    = sem.id
      ORDER BY g.id
    `);
  },

  async findById(id) {
    const rows = await query(
      `SELECT g.*,
              s.name   AS student_name,
              c.name   AS course_name,
              sem.name AS semester_name
       FROM grades g
       JOIN enrollments e   ON g.enrollment_id = e.id
       JOIN students    s   ON e.student_id     = s.id
       JOIN courses     c   ON e.course_id      = c.id
       JOIN semesters   sem ON e.semester_id    = sem.id
       WHERE g.id = ?`,
      [id]
    );

    return rows[0];
  },

  async findByEnrollment(enrollment_id) {
    const rows = await query(
      `SELECT * FROM grades WHERE enrollment_id = ?`,
      [enrollment_id]
    );

    return rows[0];
  },

  async create({ enrollment_id, grade }) {
    const result = await query(
      `INSERT INTO grades (enrollment_id, grade)
       VALUES (?, ?)`,
      [enrollment_id, grade]
    );

    return {
      id: result.insertId,
      enrollment_id,
      grade,
    };
  },

  async update(id, { grade }) {
    await query(
      `UPDATE grades
       SET grade = ?, updated_at = NOW()
       WHERE id = ?`,
      [grade, id]
    );

    return this.findById(id);
  },

  async delete(id) {
    const grade = await this.findById(id);

    await query(
      `DELETE FROM grades WHERE id = ?`,
      [id]
    );

    return grade;
  },

  async findByStudent(student_id) {
    return await query(
      `SELECT g.*,
              c.name   AS course_name,
              c.credits,
              sem.name AS semester_name
       FROM grades g
       JOIN enrollments e   ON g.enrollment_id = e.id
       JOIN courses     c   ON e.course_id      = c.id
       JOIN semesters   sem ON e.semester_id    = sem.id
       WHERE e.student_id = ?
       ORDER BY sem.name, c.name`,
      [student_id]
    );
  },

  async findByCourse(course_id) {
    return await query(
      `SELECT g.*,
              s.name   AS student_name,
              sem.name AS semester_name
       FROM grades g
       JOIN enrollments e   ON g.enrollment_id = e.id
       JOIN students    s   ON e.student_id     = s.id
       JOIN semesters   sem ON e.semester_id    = sem.id
       WHERE e.course_id = ?
       ORDER BY sem.name, s.name`,
      [course_id]
    );
  },
};

module.exports = GradeModel;