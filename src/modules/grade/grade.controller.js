// src/modules/grade/grade.controller.js
const { validationResult } = require("express-validator");
const GradeService = require("./grade.service");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

const GradeController = {
  getAll: asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const result = await GradeService.getAllGrades({ page, limit });
    return apiResponse.paginated(res, result.grades, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const grade = await GradeService.getGradeById(req.params.id);
    return apiResponse.success(res, grade);
  }),

  create: asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return apiResponse.badRequest(res, "Validation failed", errors.array());

    const grade = await GradeService.createGrade(req.body);
    return apiResponse.created(res, grade, "Grade created successfully");
  }),

  update: asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return apiResponse.badRequest(res, "Validation failed", errors.array());

    const grade = await GradeService.updateGrade(req.params.id, req.body);
    return apiResponse.success(res, grade, "Grade updated successfully");
  }),

  delete: asyncHandler(async (req, res) => {
    await GradeService.deleteGrade(req.params.id);
    return apiResponse.success(res, null, "Grade deleted successfully");
  }),

  getByStudent: asyncHandler(async (req, res) => {
    const grades = await GradeService.getGradesByStudent(req.params.student_id);
    return apiResponse.success(res, grades, "Grades fetched by student");
  }),

  getByCourse: asyncHandler(async (req, res) => {
    const grades = await GradeService.getGradesByCourse(req.params.course_id);
    return apiResponse.success(res, grades, "Grades fetched by course");
  }),

  getByEnrollment: asyncHandler(async (req, res) => {
    const grade = await GradeService.getGradeByEnrollment(req.params.enrollment_id);
    return apiResponse.success(res, grade, "Grade fetched by enrollment");
  }),
};

module.exports = GradeController;