const DepartmentModel = require("./department.model");

const DepartmentService = {
  async getAllDepartments({ page = 1, limit = 20, search = "" } = {}) {
  const parsedPage  = Math.max(1, parseInt(page) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const offset      = (parsedPage - 1) * parsedLimit;

  const [departments, total] = await Promise.all([
    DepartmentModel.findAll({ limit: parsedLimit, offset, search }),
    DepartmentModel.count(search),
  ]);

  return {
    departments,
    pagination: {
      total,
      page:       parsedPage,
      limit:      parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
},


  async getDepartmentById(id) {
    const department = await DepartmentModel.findById(id);
    if (!department) {
      const err = new Error("Department not found");
      err.statusCode = 404;
      throw err;
    }
    return department;
  },

  async createDepartment({ name, building }) {
    const existing = await DepartmentModel.findByName(name);
    if (existing) {
      const err = new Error(`Department with name '${name}' already exists`);
      err.statusCode = 409;
      throw err;
    }
    return DepartmentModel.create({ name, building });
  },

  async updateDepartment(id, data) {
    await DepartmentService.getDepartmentById(id); // 404 guard

    if (data.name) {
      const existing = await DepartmentModel.findByName(data.name);
      if (existing && existing.id !== parseInt(id)) {
        const err = new Error(`Department with name '${data.name}' already exists`);
        err.statusCode = 409;
        throw err;
      }
    }

    return DepartmentModel.update(id, data);
  },

  async deleteDepartment(id) {
    await DepartmentService.getDepartmentById(id); // 404 guard
    return DepartmentModel.delete(id);
  },
};

module.exports = DepartmentService;