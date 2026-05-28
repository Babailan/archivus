import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function seedUsers() {
  const existingUser = await prisma.user.findUnique({
    where: { username: "babi" },
  });
  const currentYear = new Date().getFullYear().toString();
  if (!existingUser) {
    const salt = await bcrypt.genSalt(10);
    await prisma.user.create({
      data: {
        id: parseInt(`${currentYear}00001`),
        email: "babailanxx@gmail.com",
        hash_password: await bcrypt.hash("admin", salt),
        username: "babi",
        first_name: "Ronnel",
        last_name: "Babailan",
        gender: "male",
        birthdate: new Date("1990-01-01"),
        role: {
          create: {
            role: "admin",
          },
        },
      },
    });
  }
}

async function seedSubjects() {
  const allSubjects = [
    { subject_code: "MATH-101", subject_name: "Mathematics" },
    { subject_code: "ENG-101", subject_name: "English" },
    { subject_code: "SCI-101", subject_name: "Science" },
    { subject_code: "FIL-101", subject_name: "Filipino" },
    {
      subject_code: "MAPEH-101",
      subject_name: "Music, Arts, Physical Education and Health",
    },
    { subject_code: "CLE-101", subject_name: "Christian Living Education" },
    { subject_code: "SS-101", subject_name: "Social Studies" },
    {
      subject_code: "TLE-101",
      subject_name: "Technology and Livelihood Education",
    },
    { subject_code: "COMP-101", subject_name: "Computer Education" },
    { subject_code: "HIST-101", subject_name: "History" },
    { subject_code: "AP-101", subject_name: "Araling Panlipunan" },
    { subject_code: "ESP-101", subject_name: "Edukasyon sa Pagpapakatao" },
    { subject_code: "PE-101", subject_name: "Physical Education" },
    { subject_code: "MUS-101", subject_name: "Music" },
    { subject_code: "ART-101", subject_name: "Art" },
  ];

  const createdSubjects: Awaited<
    ReturnType<typeof prisma.subject.findUnique>
  >[] = [];
  for (const subj of allSubjects) {
    const subject = await prisma.subject.upsert({
      where: { subject_code: subj.subject_code },
      update: {},
      create: subj,
    });
    createdSubjects.push(subject);
  }

  const subjectPrices = [
    { subject_code: "MATH-101", price: 1500 },
    { subject_code: "ENG-101", price: 1500 },
    { subject_code: "SCI-101", price: 1750 },
    { subject_code: "FIL-101", price: 1250 },
    { subject_code: "MAPEH-101", price: 1250 },
    { subject_code: "CLE-101", price: 1000 },
    { subject_code: "SS-101", price: 1250 },
    { subject_code: "TLE-101", price: 1500 },
    { subject_code: "COMP-101", price: 1500 },
    { subject_code: "HIST-101", price: 1200 },
    { subject_code: "AP-101", price: 1200 },
    { subject_code: "ESP-101", price: 1000 },
    { subject_code: "PE-101", price: 800 },
    { subject_code: "MUS-101", price: 1000 },
    { subject_code: "ART-101", price: 1000 },
  ];

  const createdPrices: Awaited<
    ReturnType<typeof prisma.subjectPrice.findFirst>
  >[] = [];
  for (const priceData of subjectPrices) {
    const subject = createdSubjects.find(
      (s) => s!.subject_code === priceData.subject_code,
    );
    if (!subject) continue;
    const existingPrice = await prisma.subjectPrice.findFirst({
      where: { subject_id: subject!.id },
    });
    if (existingPrice) {
      createdPrices.push(existingPrice);
    } else {
      const sp = await prisma.subjectPrice.create({
        data: {
          subject_id: subject!.id,
          price: priceData.price,
        },
      });
      createdPrices.push(sp);
    }
  }

  const subjectMap = new Map(createdSubjects.map((s) => [s!.subject_code, s!]));
  const priceMap = new Map(
    createdPrices.map((p, i) => [createdSubjects[i]!.subject_code, p!]),
  );

  return { subjectMap, priceMap };
}

async function seedCurriculums(
  subjectMap: Map<
    string,
    Awaited<ReturnType<typeof prisma.subject.findUnique>>
  >,
  priceMap: Map<
    string,
    Awaited<ReturnType<typeof prisma.subjectPrice.findFirst>>
  >,
) {
  const curriculumsData = [
    {
      curriculum_code: "K-12-G1-2024",
      curriculum_name: "Grade 1 Curriculum 2024",
      grade_level: "grade1" as const,
      miscellaneous_fee: 2000,
      subjects: ["MATH-101", "ENG-101", "SCI-101", "FIL-101", "MAPEH-101"],
    },
    {
      curriculum_code: "K-12-G2-2024",
      curriculum_name: "Grade 2 Curriculum 2024",
      grade_level: "grade2" as const,
      miscellaneous_fee: 2200,
      subjects: [
        "MATH-101",
        "ENG-101",
        "SCI-101",
        "FIL-101",
        "MAPEH-101",
        "CLE-101",
      ],
    },
    {
      curriculum_code: "K-12-G3-2024",
      curriculum_name: "Grade 3 Curriculum 2024",
      grade_level: "grade3" as const,
      miscellaneous_fee: 2400,
      subjects: [
        "MATH-101",
        "ENG-101",
        "SCI-101",
        "FIL-101",
        "MAPEH-101",
        "CLE-101",
      ],
    },
    {
      curriculum_code: "K-12-G4-2024",
      curriculum_name: "Grade 4 Curriculum 2024",
      grade_level: "grade4" as const,
      miscellaneous_fee: 2600,
      subjects: [
        "MATH-101",
        "ENG-101",
        "SCI-101",
        "FIL-101",
        "MAPEH-101",
        "CLE-101",
        "SS-101",
      ],
    },
    {
      curriculum_code: "K-12-G5-2024",
      curriculum_name: "Grade 5 Curriculum 2024",
      grade_level: "grade5" as const,
      miscellaneous_fee: 2800,
      subjects: [
        "MATH-101",
        "ENG-101",
        "SCI-101",
        "FIL-101",
        "MAPEH-101",
        "CLE-101",
        "SS-101",
        "TLE-101",
      ],
    },
    {
      curriculum_code: "K-12-G6-2024",
      curriculum_name: "Grade 6 Curriculum 2024",
      grade_level: "grade6" as const,
      miscellaneous_fee: 3000,
      subjects: [
        "MATH-101",
        "ENG-101",
        "SCI-101",
        "FIL-101",
        "MAPEH-101",
        "CLE-101",
        "SS-101",
        "TLE-101",
        "COMP-101",
      ],
    },
  ];

  const createdCurricula = [];
  for (const curriData of curriculumsData) {
    const curriculum = await prisma.curriculum.upsert({
      where: { curriculum_code: curriData.curriculum_code },
      update: {},
      create: {
        curriculum_code: curriData.curriculum_code,
        curriculum_name: curriData.curriculum_name,
        grade_level: curriData.grade_level,
        miscellaneous_fee: curriData.miscellaneous_fee,
      },
    });

    for (const subjCode of curriData.subjects) {
      const subject = subjectMap.get(subjCode);
      const price = priceMap.get(subjCode);
      if (!subject || !price) continue;
      const existingLink = await prisma.curriculumSubjects.findFirst({
        where: {
          curriculum_id: curriculum.id,
          subject_id: subject.id,
        },
      });
      if (!existingLink) {
        await prisma.curriculumSubjects.create({
          data: {
            curriculum_id: curriculum.id,
            subject_id: subject.id,
            subject_price_id: price.id,
          },
        });
      }
    }
    createdCurricula.push(curriculum);
  }

  return createdCurricula;
}

async function seedEnrollmentSettings(
  curriculums: Awaited<ReturnType<typeof prisma.curriculum.findUnique>>[],
) {
  const SCHOOL_YEARS = [
    "2020-2021",
    "2021-2022",
    "2022-2023",
    "2023-2024",
    "2024-2025",
    "2025-2026",
    "2026-2027",
  ];

  // EnrollmentSettings is a singleton - ensure exactly 1 row exists with id: 1
  await prisma.enrollmentSettings.deleteMany({});
  await prisma.enrollmentSettings.create({
    data: {
      id: 1,
      school_year: "2024-2025",
      is_online_enrollment_enabled: true,
    },
  });

  // Seed GradeCurriculumSetting for all school years
  for (const sy of SCHOOL_YEARS) {
    const gradeLevels = [
      "grade1",
      "grade2",
      "grade3",
      "grade4",
      "grade5",
      "grade6",
    ] as const;

    for (let idx = 0; idx < gradeLevels.length; idx++) {
      const grade = gradeLevels[idx];
      const curriculum = curriculums[idx];
      if (!curriculum) continue;
      await prisma.gradeCurriculumSetting.upsert({
        where: {
          school_year_grade_level: {
            school_year: sy,
            grade_level: grade,
          },
        },
        update: {},
        create: {
          school_year: sy,
          grade_level: grade,
          curriculum_id: curriculum.id,
        },
      });
    }
  }
}

async function main() {
  console.log("Starting lightweight seed...");

  console.log("Seeding users...");
  await seedUsers();

  console.log("Seeding subjects and prices...");
  const { subjectMap, priceMap } = await seedSubjects();

  console.log("Seeding curriculums...");
  const curricula = await seedCurriculums(subjectMap, priceMap);

  console.log("Seeding enrollment settings...");
  await seedEnrollmentSettings(curricula);

  console.log("Seed completed successfully!");
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
