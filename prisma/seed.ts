import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  user: "root",
  password:"rongrong",
  database:"mydb"
});

const prisma = new PrismaClient({
  adapter,
});


export async function main() {
  // await prisma.user.create({data:{email:"babailanxx@gmail.com","name":"babi"}})

  await prisma.$disconnect()
}

main();