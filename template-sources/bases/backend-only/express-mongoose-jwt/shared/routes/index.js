const express = require("express");

const authRoutes = require("./auth");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is healthy"
  });
});

router.use("/auth", authRoutes);

module.exports = router;
