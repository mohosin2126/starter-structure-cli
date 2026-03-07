const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");
const { errorResponse } = require("../utils/api-response");
const userSelect = require("../utils/user-select");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Unauthorized access.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: userSelect
    });

    if (!user) {
      return errorResponse(res, "User not found.", 401);
    }

    req.user = user;
    next();
  } catch (_error) {
    return errorResponse(res, "Invalid or expired token.", 401);
  }
}

module.exports = authenticate;
