const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const { sendError } = require("../utils/apiResponse");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Unauthorized: No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, "Unauthorized: Invalid or expired token", 401);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, "Forbidden: Access denied", 403);
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };