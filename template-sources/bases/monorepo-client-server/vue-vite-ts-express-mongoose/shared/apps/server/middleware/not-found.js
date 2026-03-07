const { errorResponse } = require("../utils/api-response");

function notFound(req, res) {
  return errorResponse(res, `Route not found: ${req.originalUrl}`, 404);
}

module.exports = notFound;
