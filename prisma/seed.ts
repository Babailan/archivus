import prisma from "@/lib/dbClient";

async function main() {
  const data = await prisma.subject.findMany({});
  // const salt = await bcrypt.genSalt(10);
  // await prisma.user.create({
  //   data: {
  //     email: "babailanxx@gmail.com",
  //     hash_password: await bcrypt.hash("admin", salt),
  //     username: "babi",
  //     role: {
  //       create: {
  //         role: "admin",
  //       },
  //     },
  //   },
  // });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
