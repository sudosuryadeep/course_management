// src/modules/student/student.controller.js
const { validationResult } = require("express-validator");
const StudentService = require("./student.service");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

const StudentController = {
  getAll: asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, search = "", department_id } = req.query;

    const result = await StudentService.getAllStudents({ page, limit, search, department_id });
    return apiResponse.paginated(res, result.students, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const student = await StudentService.getStudentById(req.params.id);
    return apiResponse.success(res, student);
  }),

  create: asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return apiResponse.badRequest(res, "Validation failed", errors.array());

    const student = await StudentService.createStudent(req.body);
    return apiResponse.created(res, student, "Student created successfully");
  }),

  update: asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return apiResponse.badRequest(res, "Validation failed", errors.array());

    const student = await StudentService.updateStudent(req.params.id, req.body);
    return apiResponse.success(res, student, "Student updated successfully");
  }),

  delete: asyncHandler(async (req, res) => {
    await StudentService.deleteStudent(req.params.id);
    return apiResponse.success(res, null, "Student deleted successfully");
  }),

  getByDepartment: asyncHandler(async (req, res) => {
    const students = await StudentService.getStudentsByDepartment(req.params.department_id);
    return apiResponse.success(res, students, "Students fetched by department");
  }),
};

module.exports = StudentController;