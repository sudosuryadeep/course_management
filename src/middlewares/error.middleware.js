// src/middlewares/error.middleware.js
const { sendError } = require("../utils/apiResponse");

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === "ER_DUP_ENTRY")
    return sendError(res, "Duplicate entry: A record with this value already exists.", 409);

  if (err.code === "ER_NO_REFERENCED_ROW_2")
    return sendError(res, "Foreign key violation: Referenced record does not exist.", 400);

  if (err.name === "JsonWebTokenError")
    return sendError(res, "Invalid token.", 401);

  if (err.name === "TokenExpiredError")
    return sendError(res, "Token has expired.", 401);

  if (err.name === "ValidationError")
    return sendError(res, message, 422);

  if (process.env.NODE_ENV === "development") {
    console.error("[Error]", err);
    return res.status(statusCode).json({ success: false, message, stack: err.stack });
  }

  return sendError(res, message, statusCode);
};

module.exports = { notFound, errorHandler };