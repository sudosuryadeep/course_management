// src/modules/auth/auth.service.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthModel = require("./auth.model");
const { ApiError } = require("../../utils/apiResponse");
const { JWT_SECRET } = require("../../config/env");

const AuthService = {
  async signup({ name, email, password, role }) {
    if (!name || !email || !password)
      throw new ApiError(400, "name, email aur password required hain");

    const existing = await AuthModel.findByEmail(email);
    if (existing)
      throw new ApiError(409, "Is email se account pehle se exist karta hai");

    const hashed = await bcrypt.hash(password, 10);
    const user = await AuthModel.create({ name, email, password: hashed, role });

    const token = jwt.sign(
      { id: user.id, email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { user, token };
  },

  async login({ email, password }) {
    if (!email || !password)
      throw new ApiError(400, "email aur password required hain");

    const user = await AuthModel.findByEmail(email);
    if (!user)
      throw new ApiError(401, "Invalid email ya password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new ApiError(401, "Invalid email ya password");

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...safeUser } = user; // password response mein mat bhejo
    return { user: safeUser, token };
  },

  async getMe(id) {
    const user = await AuthModel.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  },
};

module.exports = AuthService;