const express = require("express");
const router = express.Router();
const StudentController = require("./student.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

// router.use(authenticate);

router.get("/", StudentController.getAll);
router.get("/department/:department_id", StudentController.getByDepartment);
router.get("/:id", StudentController.getById);
router.post("/", StudentController.create);
router.put("/:id", StudentController.update);
router.delete("/:id", StudentController.delete);

module.exports = router;