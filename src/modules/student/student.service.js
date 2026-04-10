// src/modules/student/student.service.js
const StudentModel = require("./student.model");
const { query } = require("../../config/db");

const StudentService = {
  async getAllStudents({ page = 1, limit = 20, search = "", department_id } = {}) {
    const parsedPage  = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset      = (parsedPage - 1) * parsedLimit;
    const deptId      = department_id ? parseInt(department_id) || null : null;

    const [students, total] = await Promise.all([
      StudentModel.findAll({ limit: parsedLimit, offset, search, department_id: deptId }),
      StudentModel.count(search, deptId),
    ]);

    return {
      students,
      pagination: {
        total,
        page:       parsedPage,
        limit:      parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    };
  },

  async getStudentById(id) {
    const student = await StudentModel.findById(id);
    if (!student) {
      const err = new Error("Student not found");
      err.statusCode = 404;
      throw err;
    }
    return student;
  },

  async createStudent({ name, image, department_id }) {
    const { rows } = await query(`SELECT id FROM departments WHERE id = ?`, [department_id]);
    if (!rows.length) {
      const err = new Error(`Department with id ${department_id} not found`);
      err.statusCode = 404;
      throw err;
    }
    return StudentModel.create({ name, image, department_id });
  },

  async updateStudent(id, data) {
    await StudentService.getStudentById(id);

    if (data.department_id) {
      const { rows } = await query(`SELECT id FROM departments WHERE id = ?`, [data.department_id]);
      if (!rows.length) {
        const err = new Error(`Department with id ${data.department_id} not found`);
        err.statusCode = 404;
        throw err;
      }
    }

    return StudentModel.update(id, data);
  },

  async deleteStudent(id) {
    await StudentService.getStudentById(id);
    return StudentModel.delete(id);
  },

  async getStudentsByDepartment(department_id) {
    return StudentModel.findByDepartment(department_id);
  },
};

module.exports = StudentService;