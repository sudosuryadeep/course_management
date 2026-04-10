// src/modules/auth/auth.routes.js
const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("./auth.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

router.post("/signup", signup);
router.post("/login",  login);
router.get("/me",      authenticate, getMe); // protected

module.exports = router;