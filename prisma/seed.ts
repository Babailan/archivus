import prisma from "@/lib/dbClient";

async function main() {
  //also include the data of curriculum
  const curriculum = await prisma.curriculum.findUnique({
    where: {
      id: 6,
    },
    include: {
      curriculum_subjects: true,
    },
  });

  const {
    _sum: { price },
  } = await prisma.subjectPrice.aggregate({
    _sum: {
      price: true,
    },
    where: {
      curriculumSubjects: {
        some: {
          curriculum_id: 6,
        },
      },
    },
  });

  price;

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
