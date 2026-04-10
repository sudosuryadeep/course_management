const { sendError } = require("../utils/apiResponse");

// 404 handler — for unmatched routes
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  let message = err.message || "Internal Server Error";

  // MySQL duplicate entry
  if (err.code === "ER_DUP_ENTRY") {
    message = "Duplicate entry: A record with this value already exists.";
    return sendError(res, message, 409);
  }

  // MySQL foreign key
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    message = "Foreign key violation: Referenced record does not exist.";
    return sendError(res, message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return sendError(res, "Invalid token.", 401);
  }

  if (err.name === "TokenExpiredError") {
    return sendError(res, "Token has expired.", 401);
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return sendError(res, message, 422);
  }

  // Dev mode (detailed error)
  if (process.env.NODE_ENV === "development") {
    console.error("[Error]", err);
    return res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
    });
  }

  // Production fallback
  return sendError(res, message, statusCode);
};

module.exports = { notFound, errorHandler };