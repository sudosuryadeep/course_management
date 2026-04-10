// src/modules/semester/semester.service.js
const SemesterModel = require("./semester.model");
const { ApiError } = require("../../utils/apiResponse");

const SemesterService = {
  async createSemester(data) {
    if (!data.name || !data.name.trim())
      throw new ApiError(400, "Semester name is required.");

    return await SemesterModel.create({ name: data.name.trim() });
  },

  async getAllSemesters() {
    return await SemesterModel.findAll();
  },

  async getSemesterById(id) {
    const semester = await SemesterModel.findById(id);
    if (!semester)
      throw new ApiError(404, `Semester with id ${id} not found.`);

    return semester;
  },

  async updateSemester(id, data) {
    await SemesterService.getSemesterById(id);

    if (!data.name || !data.name.trim())
      throw new ApiError(400, "Semester name is required.");

    return await SemesterModel.update(id, { name: data.name.trim() });
  },

  async deleteSemester(id) {
    await SemesterService.getSemesterById(id);
    return await SemesterModel.delete(id);
  },

  async getSemesterEnrollments(id) {
    await SemesterService.getSemesterById(id);
    return await SemesterModel.findEnrollments(id);
  },
};

module.exports = SemesterService;