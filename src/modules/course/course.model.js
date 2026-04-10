// src/modules/course/course.model.js
const { query } = require("../../config/db");

const CourseModel = {
  async create({ name, department_id, credits, professor_id }) {
    const result = await query(
      `INSERT INTO courses (name, department_id, credits, professor_id) VALUES (?, ?, ?, ?)`,
      [name, department_id, credits, professor_id]
    );
    return { id: result.insertId, name, department_id, credits, professor_id };
  },

  async findAll({ limit = 20, offset = 0, search = "", department_id = null, professor_id = null } = {}) {
    let sql = `
      SELECT
        c.id, c.name, c.credits, c.department_id,
        d.name AS department_name,
        c.professor_id,
        p.name AS professor_name
      FROM courses c
      LEFT JOIN departments d ON d.id = c.department_id
      LEFT JOIN professors p ON p.id = c.professor_id
      WHERE c.name LIKE ?
    `;
    const params = [`%${search}%`];

    if (department_id) {
      sql += ` AND c.department_id = ?`;
      params.push(department_id);
    }
    if (professor_id) {
      sql += ` AND c.professor_id = ?`;
      params.push(professor_id);
    }

    sql += ` ORDER BY c.name LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

    const { rows } = await query(sql, params);
    return rows;
  },

  async count(search = "", department_id = null, professor_id = null) {
    let sql = `SELECT COUNT(*) AS count FROM courses WHERE name LIKE ?`;
    const params = [`%${search}%`];

    if (department_id) {
      sql += ` AND department_id = ?`;
      params.push(department_id);
    }
    if (professor_id) {
      sql += ` AND professor_id = ?`;
      params.push(professor_id);
    }

    const { rows } = await query(sql, params);
    return rows[0].count;
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT
         c.id, c.name, c.credits, c.department_id,
         d.name AS department_name,
         c.professor_id,
         p.name AS professor_name
       FROM courses c
       LEFT JOIN departments d ON d.id = c.department_id
       LEFT JOIN professors p ON p.id = c.professor_id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async update(id, data) {
    await query(
      `UPDATE courses
       SET name = COALESCE(?, name),
           department_id = COALESCE(?, department_id),
           credits = COALESCE(?, credits),
           professor_id = COALESCE(?, professor_id),
           updated_at = NOW()
       WHERE id = ?`,
      [data.name ?? null, data.department_id ?? null, data.credits ?? null, data.professor_id ?? null, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    const course = await this.findById(id);
    await query(`DELETE FROM courses WHERE id = ?`, [id]);
    return course;
  },

  async findEnrolledStudents(courseId) {
    const { rows } = await query(
      `SELECT
         e.id AS enrollment_id,
         s.id AS student_id,
         s.name AS student_name,
         s.image AS student_image,
         sem.id AS semester_id,
         sem.name AS semester_name,
         g.grade
       FROM enrollments e
       JOIN students s ON s.id = e.student_id
       JOIN semesters sem ON sem.id = e.semester_id
       LEFT JOIN grades g ON g.enrollment_id = e.id
       WHERE e.course_id = ?
       ORDER BY sem.name, s.name`,
      [courseId]
    );
    return rows;
  },
};

module.exports = CourseModel;