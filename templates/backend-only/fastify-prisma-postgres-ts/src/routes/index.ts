import type { FastifyInstance } from "fastify";

import userRoutes from "./users";

export default async function routes(fastify: FastifyInstance) {
  fastify.get("/health", async () => ({
    success: true,
    status: "ok"
  }));

  fastify.register(userRoutes, {
    prefix: "/users"
  });
}
