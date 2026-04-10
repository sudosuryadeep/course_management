const { validationResult } = require("express-validator");
const ProfessorService = require("./professor.service");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

const ProfessorController = {
  getAll: asyncHandler(async (req, res) => {
    const {
      page        = 1,
      limit       = 20,
      search      = "",
      department_id,
    } = req.query;

    const result = await ProfessorService.getAllProfessors({
      page,
      limit,
      search,
      department_id,
    });

    return apiResponse.paginated(res, result.professors, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const prof = await ProfessorService.getProfessorById(req.params.id);
    return apiResponse.success(res, prof);
  }),

  create: asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return apiResponse.badRequest(res, "Validation failed", errors.array());

    const prof = await ProfessorService.createProfessor(req.body);
    return apiResponse.created(res, prof, "Professor created successfully");
  }),

  update: asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return apiResponse.badRequest(res, "Validation failed", errors.array());

    const prof = await ProfessorService.updateProfessor(req.params.id, req.body);
    return apiResponse.success(res, prof, "Professor updated successfully");
  }),

  delete: asyncHandler(async (req, res) => {
    await ProfessorService.deleteProfessor(req.params.id);
    return apiResponse.success(res, null, "Professor deleted successfully");
  }),
};

module.exports = ProfessorController;