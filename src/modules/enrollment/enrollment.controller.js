// src/modules/enrollment/enrollment.controller.js
const { validationResult } = require("express-validator");
const EnrollmentService = require("./enrollment.service");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

const EnrollmentController = {
  getAll: asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const result = await EnrollmentService.getAllEnrollments({ page, limit });
    return apiResponse.paginated(res, result.enrollments, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const enrollment = await EnrollmentService.getEnrollmentById(req.params.id);
    return apiResponse.success(res, enrollment);
  }),

  create: asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return apiResponse.badRequest(res, "Validation failed", errors.array());

    const enrollment = await EnrollmentService.createEnrollment(req.body);
    return apiResponse.created(res, enrollment, "Enrollment created successfully");
  }),

  update: asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return apiResponse.badRequest(res, "Validation failed", errors.array());

    const enrollment = await EnrollmentService.updateEnrollment(req.params.id, req.body);
    return apiResponse.success(res, enrollment, "Enrollment updated successfully");
  }),

  delete: asyncHandler(async (req, res) => {
    await EnrollmentService.deleteEnrollment(req.params.id);
    return apiResponse.success(res, null, "Enrollment deleted successfully");
  }),

  getByStudent: asyncHandler(async (req, res) => {
    const enrollments = await EnrollmentService.getEnrollmentsByStudent(req.params.student_id);
    return apiResponse.success(res, enrollments, "Enrollments fetched by student");
  }),

  getByCourse: asyncHandler(async (req, res) => {
    const enrollments = await EnrollmentService.getEnrollmentsByCourse(req.params.course_id);
    return apiResponse.success(res, enrollments, "Enrollments fetched by course");
  }),

  getBySemester: asyncHandler(async (req, res) => {
    const enrollments = await EnrollmentService.getEnrollmentsBySemester(req.params.semester_id);
    return apiResponse.success(res, enrollments, "Enrollments fetched by semester");
  }),
};

module.exports = EnrollmentController;