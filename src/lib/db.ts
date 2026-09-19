import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaVersion: string | undefined;
};

// Bust the global cache when the schema changes (e.g., new models added).
const SCHEMA_STAMP = "v3-services";

function createClient() {
  return new PrismaClient({
    // خفّضي الضجاج في الإنتاج (Vercel) — اتركي الأخطاء والتحذيرات فقط
    log:
      process.env.NODE_ENV === "production"
        ? ["error", "warn"]
        : ["query", "error", "warn"],
  });
}

function getClient() {
  if (
    globalForPrisma.prisma &&
    globalForPrisma.prismaVersion === SCHEMA_STAMP
  ) {
    return globalForPrisma.prisma;
  }
  // Disconnect previous client if exists
  if (globalForPrisma.prisma) {
    globalForPrisma.prisma.$disconnect().catch(() => {});
  }
  const client = createClient();
  // Keep the global cache in both dev and production to avoid
  // exhausting DB connections on Vercel serverless functions.
  globalForPrisma.prisma = client;
  globalForPrisma.prismaVersion = SCHEMA_STAMP;
  return client;
}

export const db = getClient();
