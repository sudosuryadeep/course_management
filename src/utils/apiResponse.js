// src/utils/apiResponse.js
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const apiResponse = {
  success(res, data, message = "Success") {
    return res.status(200).json({ success: true, message, data });
  },

  created(res, data, message = "Created successfully") {
    return res.status(201).json({ success: true, message, data });
  },

  paginated(res, data, pagination, message = "Success") {
    return res.status(200).json({ success: true, message, data, pagination });
  },

  badRequest(res, message = "Bad request", errors = null) {
    return res.status(400).json({ success: false, message, errors });
  },

  notFound(res, message = "Not found") {
    return res.status(404).json({ success: false, message });
  },

  error(res, message = "Internal server error", statusCode = 500, errors = null) {
    return res.status(statusCode).json({ success: false, message, errors });
  },
};

module.exports = apiResponse;
module.exports.ApiError = ApiError;