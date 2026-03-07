import { Response } from "express";

export function successResponse(
  res: Response,
  data: unknown = null,
  message = "Success",
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

export function errorResponse(
  res: Response,
  message = "Something went wrong",
  statusCode = 500,
  errors: unknown = null
) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
}
