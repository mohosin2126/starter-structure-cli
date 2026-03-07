import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import prisma from "./config/prisma";
import errorHandler from "./middleware/error-handler";
import notFound from "./middleware/not-found";
import routes from "./routes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "__APP_NAME__ API is running"
  });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Prisma connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown startup error";
    console.error("Failed to start server:", message);
    process.exit(1);
  }
}

startServer();
