const { Router } = require("express");
const { body, param } = require("express-validator");
const ProfessorController = require("./professor.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

const router = Router();

const createRules = [
  body("name").trim().notEmpty().withMessage("Professor name is required"),
  body("department_id").isInt({ gt: 0 }).withMessage("Valid department_id is required"),
];

const updateRules = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid professor ID"),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("department_id").optional().isInt({ gt: 0 }).withMessage("department_id must be a positive integer"),
];

router.get("/", ProfessorController.getAll);
router.get("/:id", ProfessorController.getById);
router.post("/", authenticate, createRules, ProfessorController.create);
router.put("/:id", authenticate, updateRules, ProfessorController.update);
router.delete("/:id", authenticate, ProfessorController.delete);

module.exports = router;