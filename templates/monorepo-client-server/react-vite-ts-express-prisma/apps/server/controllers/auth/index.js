const bcrypt = require("bcryptjs");

const prisma = require("../../config/prisma");
const { successResponse, errorResponse } = require("../../utils/api-response");
const generateToken = require("../../utils/generate-token");
const userSelect = require("../../utils/user-select");

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, "Name, email, and password are required.", 400);
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return errorResponse(res, "User already exists with this email.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword
      },
      select: userSelect
    });

    const token = generateToken(user.id);

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

    const normalizedEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return errorResponse(res, "Invalid email or password.", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, "Invalid email or password.", 401);
    }

    const token = generateToken(user.id);

    const safeUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: userSelect
    });

    return successResponse(
      res,
      {
        user: safeUser,
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
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: userSelect
    });

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
