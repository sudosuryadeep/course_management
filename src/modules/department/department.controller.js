const { validationResult } = require("express-validator");
const DepartmentService = require("./department.service");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

const DepartmentController = {
  getAll: asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, search = "" } = req.query;
    const result = await DepartmentService.getAllDepartments({ page, limit, search });
    return apiResponse.paginated(res, result.departments, result.pagination);
  }),

  getById: asyncHandler(async (req, res) => {
    const department = await DepartmentService.getDepartmentById(req.params.id);
    return apiResponse.success(res, department);
  }),

  create: asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.badRequest(res, "Validation failed", errors.array());
    }
    const department = await DepartmentService.createDepartment(req.body);
    return apiResponse.created(res, department, "Department created successfully");
  }),

  update: asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.badRequest(res, "Validation failed", errors.array());
    }
    const department = await DepartmentService.updateDepartment(req.params.id, req.body);
    return apiResponse.success(res, department, "Department updated successfully");
  }),

  delete: asyncHandler(async (req, res) => {
    await DepartmentService.deleteDepartment(req.params.id);
    return apiResponse.success(res, null, "Department deleted successfully");
  }),
};

module.exports = DepartmentController;