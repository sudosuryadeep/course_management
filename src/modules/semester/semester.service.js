const SemesterModel = require("./semester.model");

const SemesterService = {
  async createSemester(data) {
    if (!data.name || !data.name.trim()) {
      const err = new Error("Semester name is required.");
      err.statusCode = 400;
      throw err;
    }
    return await SemesterModel.create({ name: data.name.trim() });
  },

  async getAllSemesters() {
    return await SemesterModel.findAll();
  },

  async getSemesterById(id) {
    const semester = await SemesterModel.findById(id);
    if (!semester) {
      const err = new Error(`Semester with id ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }
    return semester;
  },

  async updateSemester(id, data) {
    await SemesterService.getSemesterById(id); // existence check
    if (!data.name || !data.name.trim()) {
      const err = new Error("Semester name is required.");
      err.statusCode = 400;
      throw err;
    }
    const updated = await SemesterModel.update(id, { name: data.name.trim() });
    return updated;
  },

  async deleteSemester(id) {
    await SemesterService.getSemesterById(id); // existence check
    return await SemesterModel.delete(id);
  },

  async getSemesterEnrollments(id) {
    await SemesterService.getSemesterById(id); // existence check
    return await SemesterModel.findEnrollments(id);
  },
};

module.exports = SemesterService;