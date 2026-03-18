const prisma = require("../../config/prisma");

async function userRoutes(fastify) {
  fastify.get("/", async () => {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return {
      success: true,
      data: users
    };
  });

  fastify.post("/", async (request, reply) => {
    const { name, email, role } = request.body || {};

    if (!name || !email) {
      return reply.code(400).send({
        success: false,
        message: "Name and email are required."
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role || "member"
      }
    });

    return reply.code(201).send({
      success: true,
      data: user
    });
  });
}

module.exports = userRoutes;
