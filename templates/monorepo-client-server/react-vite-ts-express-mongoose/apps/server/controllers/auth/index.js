const User = require("../../models/user");
const { successResponse, errorResponse } = require("../../utils/api-response");
const generateToken = require("../../utils/generate-token");

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, "Name, email, and password are required.", 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, "User already exists with this email.", 409);
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password
    });

    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        user,
        token
      },
      "Registration successful.",
      201
    );
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required.", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse(res, "Invalid email or password.", 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, "Invalid email or password.", 401);
    }

    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        user,
        token
      },
      "Login successful."
    );
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, "User not found.", 404);
    }

    return successResponse(res, { user }, "Authenticated user fetched.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  me
};
