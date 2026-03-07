import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import prisma from "../config/prisma";
import { errorResponse } from "../utils/api-response";
import userSelect from "../utils/user-select";

export default async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Unauthorized access.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

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
