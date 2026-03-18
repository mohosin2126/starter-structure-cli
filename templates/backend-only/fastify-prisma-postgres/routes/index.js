const userRoutes = require("./users");

async function routes(fastify) {
  fastify.get("/health", async () => ({
    success: true,
    status: "ok"
  }));

  fastify.register(userRoutes, {
    prefix: "/users"
  });
}

module.exports = routes;
