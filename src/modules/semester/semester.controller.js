// src/modules/semester/semester.controller.js
const SemesterService = require("./semester.service");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

const createSemester = asyncHandler(async (req, res) => {
  const semester = await SemesterService.createSemester(req.body);
  return apiResponse.created(res, semester, "Semester created successfully");
});

const getAllSemesters = asyncHandler(async (req, res) => {
  const semesters = await SemesterService.getAllSemesters();
  return apiResponse.success(res, semesters, "Semesters fetched successfully");
});

const getSemesterById = asyncHandler(async (req, res) => {
  const semester = await SemesterService.getSemesterById(req.params.id);
  return apiResponse.success(res, semester, "Semester fetched successfully");
});

const updateSemester = asyncHandler(async (req, res) => {
  const semester = await SemesterService.updateSemester(req.params.id, req.body);
  return apiResponse.success(res, semester, "Semester updated successfully");
});

const deleteSemester = asyncHandler(async (req, res) => {
  await SemesterService.deleteSemester(req.params.id);
  return apiResponse.success(res, null, "Semester deleted successfully");
});

const getSemesterEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await SemesterService.getSemesterEnrollments(req.params.id);
  return apiResponse.success(res, enrollments, "Enrollments for semester fetched successfully");
});

module.exports = {
  createSemester,
  getAllSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester,
  getSemesterEnrollments,
};