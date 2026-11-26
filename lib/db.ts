import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __corelogicPrisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// In development, re-instantiate if `prisma generate` added new models while `next dev` stayed open.
const cached = globalForPrisma.__corelogicPrisma;
const hasInvoicingDelegates =
  cached !== undefined &&
  "companySettings" in cached &&
  "invoice" in cached;

export const prisma: PrismaClient =
  cached && hasInvoicingDelegates ? cached : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__corelogicPrisma = prisma;
}

export default prisma;
