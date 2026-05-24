import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter =
  process.env.NODE_ENV == "production"
    ? new PrismaNeon({
        connectionString: process.env["DATABASE_URL"]!,
      })
    : new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
