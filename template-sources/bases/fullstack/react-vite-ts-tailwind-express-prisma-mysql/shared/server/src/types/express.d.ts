import { Prisma } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: Prisma.UserGetPayload<{
        select: {
          id: true;
          name: true;
          email: true;
          role: true;
          createdAt: true;
          updatedAt: true;
        };
      }>;
    }
  }
}

export {};
