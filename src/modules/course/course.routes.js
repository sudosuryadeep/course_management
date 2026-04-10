const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseStudents,
} = require("./course.controller");

// Base : /api/v1/courses

router.post("/",      createCourse);     // POST   /api/v1/courses
router.get("/",       getAllCourses);    // GET    /api/v1/courses  (filter: ?department_id= &professor_id=)
router.get("/:id",    getCourseById);   // GET    /api/v1/courses/:id
router.put("/:id",    updateCourse);    // PUT    /api/v1/courses/:id
router.delete("/:id", deleteCourse);    // DELETE /api/v1/courses/:id

// Nested: get all students enrolled in this course (with grades & semesters)
router.get("/:id/students", getCourseStudents); // GET /api/v1/courses/:id/students

module.exports = router;