import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaMariaDb({
    user: process.env["DATABASE_USER"]!,
    password: process.env["DATABASE_PASSWORD"]!,
    host: process.env["DATABASE_HOST"]!,
    port: parseInt(process.env["DATABASE_PORT"]!, 10),
    database: process.env["DATABASE_NAME"]!,
    // In case you want to use SSL, you can add the following options: (when using TiDB Cloud, SSL is required)
    ssl:{
        rejectUnauthorized:true,
    }
});
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
