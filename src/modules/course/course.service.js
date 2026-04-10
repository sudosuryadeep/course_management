// src/modules/course/course.service.js
const CourseModel = require("./course.model");

const CourseService = {
  async createCourse(data) {
    const { name, department_id, credits, professor_id } = data;

    if (!name || !name.trim()) {
      const err = new Error("Course name is required.");
      err.statusCode = 400;
      throw err;
    }
    if (!department_id) {
      const err = new Error("department_id is required.");
      err.statusCode = 400;
      throw err;
    }
    if (!credits || isNaN(credits) || Number(credits) < 1) {
      const err = new Error("credits must be a positive number.");
      err.statusCode = 400;
      throw err;
    }

    return CourseModel.create({
      name: name.trim(),
      department_id,
      credits: Number(credits),
      professor_id: professor_id || null,
    });
  },

  async getAllCourses({ page = 1, limit = 20, search = "", department_id, professor_id } = {}) {
    const parsedPage  = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset      = (parsedPage - 1) * parsedLimit;
    const deptId      = department_id  ? parseInt(department_id)  || null : null;
    const profId      = professor_id   ? parseInt(professor_id)   || null : null;

    const [courses, total] = await Promise.all([
      CourseModel.findAll({ limit: parsedLimit, offset, search, department_id: deptId, professor_id: profId }),
      CourseModel.count(search, deptId, profId),
    ]);

    return {
      courses,
      pagination: {
        total,
        page:       parsedPage,
        limit:      parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    };
  },

  async getCourseById(id) {
    const course = await CourseModel.findById(id);
    if (!course) {
      const err = new Error(`Course with id ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }
    return course;
  },

  async updateCourse(id, data) {
    await CourseService.getCourseById(id);

    const { name, department_id, credits, professor_id } = data;

    if (credits !== undefined && (isNaN(credits) || Number(credits) < 1)) {
      const err = new Error("credits must be a positive number.");
      err.statusCode = 400;
      throw err;
    }

    return CourseModel.update(id, {
      name:          name?.trim()        || null,
      department_id: department_id       || null,
      credits:       credits ? Number(credits) : null,
      professor_id:  professor_id        || null,
    });
  },

  async deleteCourse(id) {
    await CourseService.getCourseById(id);
    return CourseModel.delete(id);
  },

  async getCourseStudents(id) {
    await CourseService.getCourseById(id);
    return CourseModel.findEnrolledStudents(id);
  },
};

module.exports = CourseService;