// src/modules/auth/auth.controller.js
const AuthService = require("./auth.service");
const asyncHandler = require("../../utils/asyncHandler");
const apiResponse = require("../../utils/apiResponse");

const signup = asyncHandler(async (req, res) => {
  const result = await AuthService.signup(req.body);
  return apiResponse.created(res, result, "Account successfully bana");
});

const login = asyncHandler(async (req, res) => {
  const result = await AuthService.login(req.body);
  return apiResponse.success(res, result, "Login successful");
});

const getMe = asyncHandler(async (req, res) => {
  const user = await AuthService.getMe(req.user.id);
  return apiResponse.success(res, user, "Profile fetched");
});

module.exports = { signup, login, getMe };