import { Module } from "@nestjs/common";

import { HealthController } from "./health.controller";
import { UsersController } from "./users.controller";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [HealthController, UsersController]
})
export class AppModule {}
