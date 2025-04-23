// prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Allow global `var` usage in TypeScript
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? [] : [],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
