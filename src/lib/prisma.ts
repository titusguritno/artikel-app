import { PrismaClient } from "@prisma/client";

declare global {
  // biar pas develop ga bikin banyak koneksi ke DB
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // optional: kalau mau lihat log query
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
