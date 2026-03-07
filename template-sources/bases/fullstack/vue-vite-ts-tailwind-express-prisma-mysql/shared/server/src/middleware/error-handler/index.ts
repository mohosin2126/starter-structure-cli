import { NextFunction, Request, Response } from "express";

import { errorResponse } from "../utils/api-response";

export default function errorHandler(
  error: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error.";

  if (process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  return errorResponse(res, message, statusCode, {
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined
  });
}
