const { Router } = require("express");
const { body, param } = require("express-validator");
const DepartmentController = require("./department.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

const router = Router();

// Validation rules
const createRules = [
  body("name").trim().notEmpty().withMessage("Department name is required"),
  body("building").trim().notEmpty().withMessage("Building is required"),
];

const updateRules = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid department ID"),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("building").optional().trim().notEmpty().withMessage("Building cannot be empty"),
];

// Routes
router.get("/", DepartmentController.getAll);
router.get("/:id", DepartmentController.getById);
router.post("/", authenticate, createRules, DepartmentController.create);
router.put("/:id", authenticate, updateRules, DepartmentController.update);
router.delete("/:id", authenticate, DepartmentController.delete);

module.exports = router;