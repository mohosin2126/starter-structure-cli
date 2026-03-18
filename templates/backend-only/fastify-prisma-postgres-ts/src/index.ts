import cors from "@fastify/cors";
import dotenv from "dotenv";
import Fastify from "fastify";

import prisma from "./config/prisma";
import routes from "./routes";

dotenv.config();

const app = Fastify({
  logger: true
});
const port = Number(process.env.PORT || 5000);

async function bootstrap() {
  try {
    await prisma.$connect();

    await app.register(cors, {
      origin: true
    });

    app.get("/", async () => ({
      success: true,
      message: "__APP_NAME__ API is running"
    }));

    app.register(routes, {
      prefix: "/api"
    });

    app.addHook("onClose", async () => {
      await prisma.$disconnect();
    });

    await app.listen({
      port,
      host: "0.0.0.0"
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

bootstrap();
