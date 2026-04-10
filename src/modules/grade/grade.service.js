const GradeModel = require("./grade.model");
const { ApiError } = require("../../utils/apiResponse");
const pool = require("../../config/db");

// Valid letter grades + numeric range 0-100
const VALID_LETTER_GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

function validateGrade(grade) {
  if (VALID_LETTER_GRADES.includes(String(grade).toUpperCase())) return true;
  const numeric = parseFloat(grade);
  if (!isNaN(numeric) && numeric >= 0 && numeric <= 100) return true;
  return false;
}

const GradeService = {
  async getAllGrades() {
    return await GradeModel.findAll();
  },

  async getGradeById(id) {
    const grade = await GradeModel.findById(id);
    if (!grade) throw new ApiError(404, "Grade not found");
    return grade;
  },

  async createGrade(data) {
    const { enrollment_id, grade } = data;

    if (!enrollment_id || grade === undefined || grade === null) {
      throw new ApiError(400, "enrollment_id and grade are required");
    }

    if (!validateGrade(grade)) {
      throw new ApiError(
        400,
        `Invalid grade. Use letter grade (A+, A, B, ..., F) or numeric value (0-100)`
      );
    }

    // Validate enrollment
    const enrollmentCheck = await pool.query(
      "SELECT id FROM enrollments WHERE id = $1",
      [enrollment_id]
    );
    if (enrollmentCheck.rows.length === 0) {
      throw new ApiError(404, "Enrollment not found");
    }

    // Prevent duplicate grade for same enrollment
    const existing = await GradeModel.findByEnrollment(enrollment_id);
    if (existing) {
      throw new ApiError(
        409,
        "A grade already exists for this enrollment. Use PUT to update it."
      );
    }

    return await GradeModel.create({ enrollment_id, grade: String(grade).toUpperCase() });
  },

  async updateGrade(id, data) {
    await this.getGradeById(id); // ensure exists

    const { grade } = data;
    if (grade === undefined || grade === null) {
      throw new ApiError(400, "grade field is required");
    }

    if (!validateGrade(grade)) {
      throw new ApiError(
        400,
        `Invalid grade. Use letter grade (A+, A, B, ..., F) or numeric value (0-100)`
      );
    }

    return await GradeModel.update(id, { grade: String(grade).toUpperCase() });
  },

  async deleteGrade(id) {
    const grade = await GradeModel.delete(id);
    if (!grade) throw new ApiError(404, "Grade not found");
    return grade;
  },

  async getGradesByStudent(student_id) {
    const check = await pool.query("SELECT id FROM students WHERE id = $1", [
      student_id,
    ]);
    if (check.rows.length === 0) throw new ApiError(404, "Student not found");
    return await GradeModel.findByStudent(student_id);
  },

  async getGradesByCourse(course_id) {
    const check = await pool.query("SELECT id FROM courses WHERE id = $1", [
      course_id,
    ]);
    if (check.rows.length === 0) throw new ApiError(404, "Course not found");
    return await GradeModel.findByCourse(course_id);
  },

  // Get grade by enrollment_id directly
  async getGradeByEnrollment(enrollment_id) {
    const check = await pool.query(
      "SELECT id FROM enrollments WHERE id = $1",
      [enrollment_id]
    );
    if (check.rows.length === 0)
      throw new ApiError(404, "Enrollment not found");

    const grade = await GradeModel.findByEnrollment(enrollment_id);
    if (!grade) throw new ApiError(404, "No grade found for this enrollment");
    return grade;
  },
};

module.exports = GradeService;