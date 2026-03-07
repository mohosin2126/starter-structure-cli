const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { errorResponse } = require("../utils/api-response");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Unauthorized access.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("_id name email role");
    if (!user) {
      return errorResponse(res, "User not found.", 401);
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (_error) {
    return errorResponse(res, "Invalid or expired token.", 401);
  }
}

module.exports = authenticate;
