const express = require("express");
const router = express.Router();

const {
  createSemester,
  getAllSemesters,
  getSemesterById,
  updateSemester,
  deleteSemester,
  getSemesterEnrollments,
} = require("./semester.controller");

// Base : /api/v1/semesters

router.post("/",    createSemester);      // POST   /api/v1/semesters
router.get("/",     getAllSemesters);     // GET    /api/v1/semesters
router.get("/:id",  getSemesterById);    // GET    /api/v1/semesters/:id
router.put("/:id",  updateSemester);     // PUT    /api/v1/semesters/:id
router.delete("/:id", deleteSemester);   // DELETE /api/v1/semesters/:id

// GET all enrollments in a specific semester
router.get("/:id/enrollments", getSemesterEnrollments); // GET /api/v1/semesters/:id/enrollments

module.exports = router;