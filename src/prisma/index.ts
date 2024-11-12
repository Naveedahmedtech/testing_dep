import { PrismaClient } from "@prisma/client";

type CustomGlobal = Global & {
  prisma: PrismaClient;
};

declare const global: CustomGlobal;
const prisma =
  global.prisma ||
  new PrismaClient({ log: ["query", "info", "warn", "error"] });

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
  console.log("Using cached connection.");
}

export default prisma;
