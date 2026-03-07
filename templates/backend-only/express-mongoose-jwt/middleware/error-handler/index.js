const { errorResponse } = require("../utils/api-response");

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error.";

  if (process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  return errorResponse(res, message, statusCode, {
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined
  });
}

module.exports = errorHandler;
