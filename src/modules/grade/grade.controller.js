const GradeService = require("./grade.service");
const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess } = require("../../utils/apiResponse");

const GradeController = {
  getAll: asyncHandler(async (req, res) => {
    const grades = await GradeService.getAllGrades();
    sendSuccess(res, "Grades fetched successfully", grades);
  }),

  getById: asyncHandler(async (req, res) => {
    const grade = await GradeService.getGradeById(req.params.id);
    sendSuccess(res, "Grade fetched successfully", grade);
  }),

  create: asyncHandler(async (req, res) => {
    const grade = await GradeService.createGrade(req.body);
    sendSuccess(res, "Grade created successfully", grade, 201);
  }),

  update: asyncHandler(async (req, res) => {
    const grade = await GradeService.updateGrade(req.params.id, req.body);
    sendSuccess(res, "Grade updated successfully", grade);
  }),

  delete: asyncHandler(async (req, res) => {
    await GradeService.deleteGrade(req.params.id);
    sendSuccess(res, "Grade deleted successfully", null);
  }),

  getByStudent: asyncHandler(async (req, res) => {
    const grades = await GradeService.getGradesByStudent(
      req.params.student_id
    );
    sendSuccess(res, "Grades fetched by student", grades);
  }),

  getByCourse: asyncHandler(async (req, res) => {
    const grades = await GradeService.getGradesByCourse(req.params.course_id);
    sendSuccess(res, "Grades fetched by course", grades);
  }),

  getByEnrollment: asyncHandler(async (req, res) => {
    const grade = await GradeService.getGradeByEnrollment(
      req.params.enrollment_id
    );
    sendSuccess(res, "Grade fetched by enrollment", grade);
  }),
};

module.exports = GradeController;