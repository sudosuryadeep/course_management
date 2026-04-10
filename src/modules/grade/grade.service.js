// src/modules/grade/grade.service.js
const GradeModel = require("./grade.model");
const { query } = require("../../config/db");
const { ApiError } = require("../../utils/apiResponse");

const VALID_LETTER_GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

function validateGrade(grade) {
  if (VALID_LETTER_GRADES.includes(String(grade).toUpperCase())) return true;
  const numeric = parseFloat(grade);
  if (!isNaN(numeric) && numeric >= 0 && numeric <= 100) return true;
  return false;
}

const GradeService = {
  async getAllGrades({ page = 1, limit = 20 } = {}) {
    const parsedPage  = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset      = (parsedPage - 1) * parsedLimit;

    const [grades, total] = await Promise.all([
      GradeModel.findAll({ limit: parsedLimit, offset }),
      GradeModel.count(),
    ]);

    return {
      grades,
      pagination: {
        total,
        page:       parsedPage,
        limit:      parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    };
  },

  async getGradeById(id) {
    const grade = await GradeModel.findById(id);
    if (!grade) throw new ApiError(404, "Grade not found");
    return grade;
  },

  async createGrade({ enrollment_id, grade }) {
    if (!enrollment_id || grade === undefined || grade === null)
      throw new ApiError(400, "enrollment_id and grade are required");

    if (!validateGrade(grade))
      throw new ApiError(400, "Invalid grade. Use letter grade (A+, A, B, ..., F) or numeric value (0-100)");

    // ✅ MySQL syntax
    const { rows: enrollRows } = await query(`SELECT id FROM enrollments WHERE id = ?`, [enrollment_id]);
    if (!enrollRows.length) throw new ApiError(404, "Enrollment not found");

    const existing = await GradeModel.findByEnrollment(enrollment_id);
    if (existing) throw new ApiError(409, "A grade already exists for this enrollment. Use PUT to update it.");

    return GradeModel.create({ enrollment_id, grade: String(grade).toUpperCase() });
  },

  async updateGrade(id, { grade }) {
    await this.getGradeById(id);

    if (grade === undefined || grade === null)
      throw new ApiError(400, "grade field is required");

    if (!validateGrade(grade))
      throw new ApiError(400, "Invalid grade. Use letter grade (A+, A, B, ..., F) or numeric value (0-100)");

    return GradeModel.update(id, { grade: String(grade).toUpperCase() });
  },

  async deleteGrade(id) {
    const grade = await GradeModel.delete(id);
    if (!grade) throw new ApiError(404, "Grade not found");
    return grade;
  },

  async getGradesByStudent(student_id) {
    const { rows } = await query(`SELECT id FROM students WHERE id = ?`, [student_id]);
    if (!rows.length) throw new ApiError(404, "Student not found");
    return GradeModel.findByStudent(student_id);
  },

  async getGradesByCourse(course_id) {
    const { rows } = await query(`SELECT id FROM courses WHERE id = ?`, [course_id]);
    if (!rows.length) throw new ApiError(404, "Course not found");
    return GradeModel.findByCourse(course_id);
  },

  async getGradeByEnrollment(enrollment_id) {
    const { rows } = await query(`SELECT id FROM enrollments WHERE id = ?`, [enrollment_id]);
    if (!rows.length) throw new ApiError(404, "Enrollment not found");

    const grade = await GradeModel.findByEnrollment(enrollment_id);
    if (!grade) throw new ApiError(404, "No grade found for this enrollment");
    return grade;
  },
};

module.exports = GradeService;