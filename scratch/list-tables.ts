import "dotenv/config";
import prisma from "../lib/prisma";

async function main() {
  const tables = await prisma.$queryRaw`
    SELECT table_name::text 
    FROM information_schema.tables 
    WHERE table_schema='public'
  `;
  console.log("Tables in database:", tables);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
