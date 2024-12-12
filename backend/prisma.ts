import { PrismaClient } from "@prisma/client/edge";
import { DATABASE_URL } from "./config.ts";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});
