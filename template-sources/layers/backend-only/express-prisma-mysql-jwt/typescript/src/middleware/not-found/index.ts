import { Request, Response } from "express";

import { errorResponse } from "../utils/api-response";

export default function notFound(req: Request, res: Response) {
  return errorResponse(res, `Route not found: ${req.originalUrl}`, 404);
}
