const SemesterService = require("./semester.service");
const asyncHandler = require("../../utils/asyncHandler");
const { successResponse, sendError } = require("../../utils/apiResponse");

const createSemester = asyncHandler(async (req, res) => {
  const semester = await SemesterService.createSemester(req.body);
  return res.status(201).json(successResponse("Semester created successfully.", semester));
});

const getAllSemesters = asyncHandler(async (req, res) => {
  const semesters = await SemesterService.getAllSemesters();
  return res.status(200).json(successResponse("Semesters fetched successfully.", semesters));
});

const getSemesterById = asyncHandler(async (req, res) => {
  const semester = await SemesterService.getSemesterById(req.params.id);
  return res.status(200).json(successResponse("Semester fetched successfully.", semester));
});

const updateSemester = asyncHandler(async (req, res) => {
  const semester = await SemesterService.updateSemester(req.params.id, req.body);
  return res.status(200).json(successResponse("Semester updated successfully.", semester));
});

const deleteSemester = asyncHandler(async (req, res) => {
  await SemesterService.deleteSemester(req.params.id);
  return res.status(200).json(successResponse("Semester deleted successfully.", null));
});

const getSemesterEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await SemesterService.getSemesterEnrollments(req.params.id);
  return res.status(200).json(
    successResponse("Enrollments for semester fetched successfully.", enrollments)
  );
});

module.exports = {
  createSemester,
  getAllSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester,
  getSemesterEnrollments,
};