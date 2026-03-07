import { Controller, Get } from "@nestjs/common";

@Controller("api/health")
export class HealthController {
  @Get()
  health() {
    return {
      ok: true,
      service: "nestjs-api"
    };
  }
}
