import { Router } from "express";

import authRoutes from "./auth";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is healthy"
  });
});

router.use("/auth", authRoutes);

export default router;
