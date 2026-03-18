import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";

import prisma from "../../config/prisma";
import { errorResponse, successResponse } from "../../utils/api-response";
import generateToken from "../../utils/generate-token";
import userSelect from "../../utils/user-select";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

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

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

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

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return errorResponse(res, "Unauthorized access.", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
