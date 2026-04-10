// src/modules/course/course.controller.js
const { validationResult } = require("express-validator");
const CourseService = require("./course.service");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

const createCourse = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return apiResponse.badRequest(res, "Validation failed", errors.array());

  const course = await CourseService.createCourse(req.body);
  return apiResponse.created(res, course, "Course created successfully");
});

const getAllCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", department_id, professor_id } = req.query;

  const result = await CourseService.getAllCourses({ page, limit, search, department_id, professor_id });
  return apiResponse.paginated(res, result.courses, result.pagination);
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await CourseService.getCourseById(req.params.id);
  return apiResponse.success(res, course);
});

const updateCourse = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return apiResponse.badRequest(res, "Validation failed", errors.array());

  const course = await CourseService.updateCourse(req.params.id, req.body);
  return apiResponse.success(res, course, "Course updated successfully");
});

const deleteCourse = asyncHandler(async (req, res) => {
  await CourseService.deleteCourse(req.params.id);
  return apiResponse.success(res, null, "Course deleted successfully");
});

const getCourseStudents = asyncHandler(async (req, res) => {
  const students = await CourseService.getCourseStudents(req.params.id);
  return apiResponse.success(res, students, "Students in course fetched successfully");
});

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseStudents,
};