const express = require("express");
const router = express.Router();
const EnrollmentController = require("./enrollment.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

router.use(authenticate);

router.get("/", EnrollmentController.getAll);
router.get("/student/:student_id", EnrollmentController.getByStudent);
router.get("/course/:course_id", EnrollmentController.getByCourse);
router.get("/semester/:semester_id", EnrollmentController.getBySemester);
router.get("/:id", EnrollmentController.getById);
router.post("/", EnrollmentController.create);
router.put("/:id", EnrollmentController.update);
router.delete("/:id", EnrollmentController.delete);

module.exports = router;