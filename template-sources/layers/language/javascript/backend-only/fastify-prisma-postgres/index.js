const dotenv = require("dotenv");
const Fastify = require("fastify");
const cors = require("@fastify/cors");

const prisma = require("./config/prisma");
const routes = require("./routes");

dotenv.config();

const app = Fastify({
  logger: true
});
const port = Number(process.env.PORT || 5000);

app.register(cors, {
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

async function startServer() {
  try {
    await prisma.$connect();
    await app.listen({
      port,
      host: "0.0.0.0"
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

startServer();
