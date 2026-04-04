import prisma from "@/lib/dbClient";
import bcrypt from "bcryptjs";

async function main() {
  const salt = await bcrypt.genSalt(10);
  await prisma.user.create({
    data: {
      email: "babailanxx@gmail.com",
      hash_password: await bcrypt.hash("admin", salt),
      username: "babi",
      role: {
        create: {
          role: "admin",
        },
      },
    },
  });

  const subjects = await Promise.all([
    prisma.subject.create({
      data: {
        subject_code: "MATH-101",
        subject_name: "Mathematics",
      },
    }),
    prisma.subject.create({
      data: {
        subject_code: "ENG-101",
        subject_name: "English",
      },
    }),
    prisma.subject.create({
      data: {
        subject_code: "SCI-101",
        subject_name: "Science",
      },
    }),
    prisma.subject.create({
      data: {
        subject_code: "FIL-101",
        subject_name: "Filipino",
      },
    }),
    prisma.subject.create({
      data: {
        subject_code: "MAPEH-101",
        subject_name: "Music, Arts, Physical Education and Health",
      },
    }),
    prisma.subject.create({
      data: {
        subject_code: "CLE-101",
        subject_name: "Christian Living Education",
      },
    }),
    prisma.subject.create({
      data: {
        subject_code: "SS-101",
        subject_name: "Social Studies",
      },
    }),
    prisma.subject.create({
      data: {
        subject_code: "TLE-101",
        subject_name: "Technology and Livelihood Education",
      },
    }),
  ]);

  const subjectPrices = await Promise.all([
    prisma.subjectPrice.create({
      data: { subject_code: "MATH-101", price: 1500 },
    }),
    prisma.subjectPrice.create({
      data: { subject_code: "ENG-101", price: 1500 },
    }),
    prisma.subjectPrice.create({
      data: { subject_code: "SCI-101", price: 1750 },
    }),
    prisma.subjectPrice.create({
      data: { subject_code: "FIL-101", price: 1250 },
    }),
    prisma.subjectPrice.create({
      data: { subject_code: "MAPEH-101", price: 1250 },
    }),
    prisma.subjectPrice.create({
      data: { subject_code: "CLE-101", price: 1000 },
    }),
    prisma.subjectPrice.create({
      data: { subject_code: "SS-101", price: 1250 },
    }),
    prisma.subjectPrice.create({
      data: { subject_code: "TLE-101", price: 1500 },
    }),
  ]);

  const curriculum1 = await prisma.curriculum.create({
    data: {
      curriculum_code: "K-12-G1-2024",
      curriculum_name: "Grade 1 Curriculum 2024",
      grade_level: "grade1",
      miscellaneous_fee: 2000,
      curriculum_subjects: {
        create: subjectPrices.slice(0, 5).map((sp, index) => ({
          subject_id: subjects[index].id,
          subject_price_id: sp.id,
        })),
      },
    },
  });

  const curriculum2 = await prisma.curriculum.create({
    data: {
      curriculum_code: "K-12-G2-2024",
      curriculum_name: "Grade 2 Curriculum 2024",
      grade_level: "grade2",
      miscellaneous_fee: 2200,
      curriculum_subjects: {
        create: subjectPrices.slice(0, 6).map((sp, index) => ({
          subject_id: subjects[index].id,
          subject_price_id: sp.id,
        })),
      },
    },
  });

  const curriculum3 = await prisma.curriculum.create({
    data: {
      curriculum_code: "K-12-G3-2024",
      curriculum_name: "Grade 3 Curriculum 2024",
      grade_level: "grade3",
      miscellaneous_fee: 2400,
      curriculum_subjects: {
        create: subjectPrices.slice(0, 6).map((sp, index) => ({
          subject_id: subjects[index].id,
          subject_price_id: sp.id,
        })),
      },
    },
  });

  const curriculum4 = await prisma.curriculum.create({
    data: {
      curriculum_code: "K-12-G4-2024",
      curriculum_name: "Grade 4 Curriculum 2024",
      grade_level: "grade4",
      miscellaneous_fee: 2600,
      curriculum_subjects: {
        create: subjectPrices.slice(0, 7).map((sp, index) => ({
          subject_id: subjects[index].id,
          subject_price_id: sp.id,
        })),
      },
    },
  });

  await prisma.enrollmentSettings.create({
    data: {
      grade1_curriculum_id: curriculum1.id,
      grade2_curriculum_id: curriculum2.id,
      grade3_curriculum_id: curriculum3.id,
      grade4_curriculum_id: curriculum4.id,
      is_online_enrollment_enabled: true,
    },
  });

  console.log("Seed data created successfully");
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
