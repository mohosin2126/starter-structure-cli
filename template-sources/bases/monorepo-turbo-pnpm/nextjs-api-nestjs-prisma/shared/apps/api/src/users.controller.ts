import { Body, Controller, Get, Post } from "@nestjs/common";

import { PrismaService } from "./prisma/prisma.service";

@Controller("api/users")
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  listUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10
    });
  }

  @Post()
  createUser(@Body() body: { name?: string; email?: string; role?: string }) {
    if (!body.name || !body.email) {
      return {
        error: "Name and email are required."
      };
    }

    return this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        role: body.role || "user"
      }
    });
  }
}
