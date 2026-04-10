// src/modules/enrollment/enrollment.service.js
const EnrollmentModel = require("./enrollment.model");
const { query } = require("../../config/db");
const { ApiError } = require("../../utils/apiResponse");

const EnrollmentService = {
  async getAllEnrollments({ page = 1, limit = 20 } = {}) {
    const parsedPage  = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset      = (parsedPage - 1) * parsedLimit;

    const [enrollments, total] = await Promise.all([
      EnrollmentModel.findAll({ limit: parsedLimit, offset }),
      EnrollmentModel.count(),
    ]);

    return {
      enrollments,
      pagination: {
        total,
        page:       parsedPage,
        limit:      parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    };
  },

  async getEnrollmentById(id) {
    const enrollment = await EnrollmentModel.findById(id);
    if (!enrollment) throw new ApiError(404, "Enrollment not found");
    return enrollment;
  },

  async createEnrollment({ student_id, course_id, semester_id }) {
    if (!student_id || !course_id || !semester_id)
      throw new ApiError(400, "student_id, course_id, and semester_id are required");

    // ✅ MySQL syntax — ? placeholder, destructure { rows }
    const { rows: studentRows } = await query(`SELECT id FROM students WHERE id = ?`, [student_id]);
    if (!studentRows.length) throw new ApiError(404, "Student not found");

    const { rows: courseRows } = await query(`SELECT id FROM courses WHERE id = ?`, [course_id]);
    if (!courseRows.length) throw new ApiError(404, "Course not found");

    const { rows: semRows } = await query(`SELECT id FROM semesters WHERE id = ?`, [semester_id]);
    if (!semRows.length) throw new ApiError(404, "Semester not found");

    const duplicate = await EnrollmentModel.findDuplicate(student_id, course_id, semester_id);
    if (duplicate) throw new ApiError(409, "Student is already enrolled in this course for this semester");

    return EnrollmentModel.create({ student_id, course_id, semester_id });
  },

  async updateEnrollment(id, data) {
    await this.getEnrollmentById(id);

    if (data.student_id) {
      const { rows } = await query(`SELECT id FROM students WHERE id = ?`, [data.student_id]);
      if (!rows.length) throw new ApiError(404, "Student not found");
    }
    if (data.course_id) {
      const { rows } = await query(`SELECT id FROM courses WHERE id = ?`, [data.course_id]);
      if (!rows.length) throw new ApiError(404, "Course not found");
    }
    if (data.semester_id) {
      const { rows } = await query(`SELECT id FROM semesters WHERE id = ?`, [data.semester_id]);
      if (!rows.length) throw new ApiError(404, "Semester not found");
    }

    return EnrollmentModel.update(id, data);
  },

  async deleteEnrollment(id) {
    await this.getEnrollmentById(id);
    return EnrollmentModel.delete(id);
  },

  async getEnrollmentsByStudent(student_id) {
    const { rows } = await query(`SELECT id FROM students WHERE id = ?`, [student_id]);
    if (!rows.length) throw new ApiError(404, "Student not found");
    return EnrollmentModel.findByStudent(student_id);
  },

  async getEnrollmentsByCourse(course_id) {
    const { rows } = await query(`SELECT id FROM courses WHERE id = ?`, [course_id]);
    if (!rows.length) throw new ApiError(404, "Course not found");
    return EnrollmentModel.findByCourse(course_id);
  },

  async getEnrollmentsBySemester(semester_id) {
    const { rows } = await query(`SELECT id FROM semesters WHERE id = ?`, [semester_id]);
    if (!rows.length) throw new ApiError(404, "Semester not found");
    return EnrollmentModel.findBySemester(semester_id);
  },
};

module.exports = EnrollmentService;