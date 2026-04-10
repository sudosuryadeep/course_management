const express = require("express");
const router = express.Router();
const GradeController = require("./grade.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

router.use(authenticate);

router.get("/", GradeController.getAll);
router.get("/student/:student_id", GradeController.getByStudent);
router.get("/course/:course_id", GradeController.getByCourse);
router.get("/enrollment/:enrollment_id", GradeController.getByEnrollment);
router.get("/:id", GradeController.getById);
router.post("/", GradeController.create);
router.put("/:id", GradeController.update);
router.delete("/:id", GradeController.delete);

module.exports = router;