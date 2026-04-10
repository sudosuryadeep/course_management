const ProfessorModel = require("./professor.model");
const { query } = require("../../config/db");

const ProfessorService = {
  async getAllProfessors({ page = 1, limit = 20, search = "", department_id } = {}) {
    // ✅ Parse to integers first, before any arithmetic
    const parsedPage  = Math.max(1, parseInt(page)  || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset      = (parsedPage - 1) * parsedLimit;

const deptId = department_id ? parseInt(department_id) || null : null;

const [professors, total] = await Promise.all([
  ProfessorModel.findAll({ limit: parsedLimit, offset, search, department_id: deptId }),
  ProfessorModel.count(search, deptId),
]);

    return {
      professors,
      pagination: {
        total,
        page:       parsedPage,
        limit:      parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    };
  },

  async getProfessorById(id) {
    const prof = await ProfessorModel.findById(id);
    if (!prof) {
      const err = new Error("Professor not found");
      err.statusCode = 404;
      throw err;
    }
    return prof;
  },

  async createProfessor({ name, department_id }) {
    const { rows } = await query(`SELECT id FROM departments WHERE id = ?`, [department_id]);
    if (!rows.length) {
      const err = new Error(`Department with id ${department_id} not found`);
      err.statusCode = 404;
      throw err;
    }
    return ProfessorModel.create({ name, department_id });
  },

  async updateProfessor(id, data) {
    await ProfessorService.getProfessorById(id);

    if (data.department_id) {
      const { rows } = await query(`SELECT id FROM departments WHERE id = ?`, [data.department_id]);
      if (!rows.length) {
        const err = new Error(`Department with id ${data.department_id} not found`);
        err.statusCode = 404;
        throw err;
      }
    }

    return ProfessorModel.update(id, data);
  },

  async deleteProfessor(id) {
    await ProfessorService.getProfessorById(id);
    return ProfessorModel.delete(id);
  },
};

module.exports = ProfessorService;