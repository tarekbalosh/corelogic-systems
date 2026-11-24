import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __corelogicPrisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.__corelogicPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__corelogicPrisma = prisma;
}

export default prisma;
