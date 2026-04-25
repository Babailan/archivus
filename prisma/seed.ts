import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { generateReferenceCode } from "@/lib/helper";

const STUDENT_COUNT = 25000;
const SCHOOL_YEARS = [
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
];

function randomDateBetween(start: Date, end: Date): Date {
  return faker.date.between({ from: start, to: end });
}

function generateDateOfBirth(): Date {
  const ages = [5, 6, 7, 8, 9, 10, 11, 12];
  const age = faker.helpers.arrayElement(ages);
  const year = 2026 - age - faker.number.int({ min: 0, max: 2 });
  const month = faker.number.int({ min: 1, max: 12 });
  const day = faker.number.int({ min: 1, max: 28 });
  return new Date(year, month - 1, day);
}

async function seedUsers() {
  const existingUser = await prisma.user.findUnique({
    where: { username: "babi" },
  });
  if (!existingUser) {
    const salt = await bcrypt.genSalt(10);
    await prisma.user.create({
      data: {
        email: "babailanxx@gmail.com",
        hash_password: await bcrypt.hash("admin", salt),
        username: "babi",
        first_name: "Admin",
        last_name: "User",
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

  const cashierUser = await prisma.user.findFirst({
    where: {
      role: {
        some: { role: "cashier" },
      },
    },
  });
  if (!cashierUser) {
    const salt = await bcrypt.genSalt(10);
    await prisma.user.create({
      data: {
        email: "cashier@archivus.edu",
        hash_password: await bcrypt.hash("cashier", salt),
        username: "cashier",
        first_name: "Cashier",
        last_name: "Staff",
        gender: "female",
        birthdate: new Date("1995-05-15"),
        role: {
          create: {
            role: "cashier",
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
    { subject_code: "MAPEH-101", subject_name: "Music, Arts, Physical Education and Health" },
    { subject_code: "CLE-101", subject_name: "Christian Living Education" },
    { subject_code: "SS-101", subject_name: "Social Studies" },
    { subject_code: "TLE-101", subject_name: "Technology and Livelihood Education" },
    { subject_code: "COMP-101", subject_name: "Computer Education" },
    { subject_code: "HIST-101", subject_name: "History" },
    { subject_code: "AP-101", subject_name: "Araling Panlipunan" },
    { subject_code: "ESP-101", subject_name: "Edukasyon sa Pagpapakatao" },
    { subject_code: "PE-101", subject_name: "Physical Education" },
    { subject_code: "MUS-101", subject_name: "Music" },
    { subject_code: "ART-101", subject_name: "Art" },
  ];

  const createdSubjects: Awaited<ReturnType<typeof prisma.subject.findUnique>>[] = [];
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

  const createdPrices: Awaited<ReturnType<typeof prisma.subjectPrice.findFirst>>[] = [];
  for (const priceData of subjectPrices) {
    const subject = createdSubjects.find((s) => s!.subject_code === priceData.subject_code);
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
  const priceMap = new Map(createdPrices.map((p, i) => [createdSubjects[i]!.subject_code, p!]));

  return { subjectMap, priceMap, createdSubjects, createdPrices };
}

async function seedCurriculums(subjectMap: Map<string, Awaited<ReturnType<typeof prisma.subject.findUnique>>>, priceMap: Map<string, Awaited<ReturnType<typeof prisma.subjectPrice.findFirst>>>) {
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
      subjects: ["MATH-101", "ENG-101", "SCI-101", "FIL-101", "MAPEH-101", "CLE-101"],
    },
    {
      curriculum_code: "K-12-G3-2024",
      curriculum_name: "Grade 3 Curriculum 2024",
      grade_level: "grade3" as const,
      miscellaneous_fee: 2400,
      subjects: ["MATH-101", "ENG-101", "SCI-101", "FIL-101", "MAPEH-101", "CLE-101"],
    },
    {
      curriculum_code: "K-12-G4-2024",
      curriculum_name: "Grade 4 Curriculum 2024",
      grade_level: "grade4" as const,
      miscellaneous_fee: 2600,
      subjects: ["MATH-101", "ENG-101", "SCI-101", "FIL-101", "MAPEH-101", "CLE-101", "SS-101"],
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

async function seedEnrollmentSettings(curriculums: Awaited<ReturnType<typeof prisma.curriculum.findUnique>>[]) {
  for (const sy of SCHOOL_YEARS) {
    const existing = await prisma.enrollmentSettings.findFirst({
      where: { school_year: sy },
    });
    if (!existing) {
      await prisma.enrollmentSettings.create({
        data: {
          school_year: sy,
          is_online_enrollment_enabled: true,
        },
      });

      const gradeLevels = ["grade1", "grade2", "grade3", "grade4", "grade5", "grade6"] as const;

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
}

async function seedStudents(count: number) {
  console.log(`Creating ${count} students...`);
  const students = [];
  const batchSize = 1000;

  for (let i = 0; i < count; i++) {
    students.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      middle_name: faker.person.middleName() || "",
      date_of_birth: generateDateOfBirth(),
      address: faker.location.streetAddress(),
      gender: faker.helpers.arrayElement(["male", "female"]),
      email: faker.internet.email(),
    });

    if (students.length >= batchSize || i === count - 1) {
      await prisma.student.createMany({ data: students });
      console.log(`Created ${i + 1} students...`);
      students.length = 0;
    }
  }
}

async function seedEnrollments(
  curriculums: Awaited<ReturnType<typeof prisma.curriculum.findUnique>>[],
  _gradeCurriculumMap: Map<string, number>
) {
  const totalStudents = await prisma.student.count();
  console.log(`Creating enrollments for ${totalStudents} students...`);

  const gradeLevels = ["grade1", "grade2", "grade3", "grade4", "grade5", "grade6"];
  const enrollmentStatuses = ["pending", "approved", "declined", "dropped"] as const;

  const curriculumPriceMap = new Map<number, number>();
  for (const c of curriculums) {
    if (!c) continue;
    const subjects = await prisma.curriculumSubjects.findMany({
      where: { curriculum_id: c.id },
      include: { subject_price: true },
    });
    const tuition = subjects.reduce((sum, cs) => sum + Number(cs.subject_price.price), 0);
    const misc = Number(c.miscellaneous_fee);
    curriculumPriceMap.set(c.id, tuition + misc);
  }

  interface EnrollmentData {
  student_id: number;
  curriculum_id: number;
  school_year: string;
  status: "pending" | "approved" | "declined" | "dropped";
  total_tuition_snapshot: number;
  total_misc_snapshot: number;
  reference_code: string;
}

interface PaymentData {
  enrollment_id: number;
  amount_paid: number;
  receipt_no: string;
  payment_date: Date;
}

const allEnrollments: EnrollmentData[] = [];
  const enrollmentInfo: { studentId: number; enrollmentId: number; totalAmount: number; isOldSchoolYear: boolean }[] = [];

  for (let studentId = 1; studentId <= totalStudents; studentId++) {
    const numEnrollments = faker.number.int({ min: 1, max: 3 });
    const usedSchoolYears = new Set<string>();

    for (let e = 0; e < numEnrollments; e++) {
      let schoolYear: string;
      let attempts = 0;
      do {
        schoolYear = faker.helpers.arrayElement(SCHOOL_YEARS);
        attempts++;
      } while (usedSchoolYears.has(schoolYear) && attempts < 10);
      usedSchoolYears.add(schoolYear);

      const gradeLevel = faker.helpers.arrayElement(gradeLevels);
      const curriculum = curriculums.find((c) => c!.grade_level === gradeLevel);
      if (!curriculum) continue;

      const totalAmount = curriculumPriceMap.get(curriculum.id) || 0;
      const totalTuition = totalAmount - Number(curriculum.miscellaneous_fee);
      const totalMisc = Number(curriculum.miscellaneous_fee);
      const status = faker.helpers.arrayElement(enrollmentStatuses);
      const isOldSchoolYear = schoolYear.startsWith("202");

      const referenceCode = generateReferenceCode(schoolYear, studentId);

      allEnrollments.push({
        student_id: studentId,
        curriculum_id: curriculum.id,
        school_year: schoolYear,
        status,
        total_tuition_snapshot: totalTuition,
        total_misc_snapshot: totalMisc,
        reference_code: referenceCode,
      });

      if (status === "approved") {
        enrollmentInfo.push({
          studentId,
          enrollmentId: 0,
          totalAmount,
          isOldSchoolYear,
        });
      }
    }

    if (studentId % 5000 === 0) {
      console.log(`Generated enrollment data for ${studentId} students...`);
    }
  }

  console.log(`Inserting ${allEnrollments.length} enrollments...`);
  await prisma.enrollment.createMany({ data: allEnrollments, skipDuplicates: true });

  const savedEnrollments = await prisma.enrollment.findMany({
    select: { id: true, student_id: true, school_year: true },
    orderBy: { id: "asc" },
  });

  const enrollmentIdMap = new Map<string, number>();
  for (const enroll of savedEnrollments) {
    const key = `${enroll.student_id}-${enroll.school_year}`;
    enrollmentIdMap.set(key, enroll.id);
  }

  for (const info of enrollmentInfo) {
    const key = `${info.studentId}-2025-2026`;
    const id = enrollmentIdMap.get(key);
    if (id) info.enrollmentId = id;
  }

  console.log(`Generating payments for ${enrollmentInfo.length} approved enrollments...`);

  const allPayments: PaymentData[] = [];

  for (const info of enrollmentInfo) {
    if (!info.enrollmentId) continue;

    const shouldHavePayments = faker.datatype.boolean({ probability: 85 });
    if (!shouldHavePayments) continue;

    const { totalAmount, isOldSchoolYear } = info;
    const isFullyPaid = faker.datatype.boolean({ probability: 70 });
    const totalPaid = isFullyPaid
      ? totalAmount
      : faker.number.int({
          min: Math.floor(totalAmount * 0.3),
          max: Math.floor(totalAmount * 0.9),
        });

    const numPayments = faker.number.int({ min: 1, max: 3 });
    let remaining = totalPaid;

    for (let p = 0; p < numPayments; p++) {
      const amount = p === numPayments - 1 ? remaining : faker.number.int({
        min: Math.floor(totalAmount * 0.1),
        max: Math.max(Math.floor(totalAmount * 0.1), Math.floor(remaining / 2)),
      });
      remaining -= amount;

      let paymentDate: Date;
      if (isOldSchoolYear) {
        paymentDate = randomDateBetween(new Date(2020, 3, 1), new Date(2026, 8, 31));
      } else {
        paymentDate = faker.date.recent({ days: 60 });
      }

      allPayments.push({
        enrollment_id: info.enrollmentId,
        amount_paid: amount,
        receipt_no: `RCP-${faker.string.alphanumeric(8).toUpperCase()}`,
        payment_date: paymentDate,
      });
    }
  }

  console.log(`Inserting ${allPayments.length} payments...`);
  await prisma.tuitionFeePayment.createMany({ data: allPayments, skipDuplicates: true });

  console.log(`Created ${allEnrollments.length} enrollments and ${allPayments.length} payments`);
}

async function seedRollbacks() {
  console.log("Creating rollback requests...");

  const approvedPayments = await prisma.tuitionFeePayment.findMany({
    include: {
      enrollment: {
        include: { student: true },
      },
    },
    take: 5000,
  });

  if (approvedPayments.length === 0) return;

  const adminUser = await prisma.user.findFirst({
    where: {
      role: {
        some: { role: "admin" },
      },
    },
  });

  if (!adminUser) return;

  const rollbackStatuses = ["pending", "approved", "denied", "cancelled"] as const;
  const rollbackReasons = [
    "Wrong amount paid",
    "Student transferred to another school",
    "Enrollment cancelled by parent",
    "Duplicate payment",
    "Financial hardship",
    "Student withdrew",
    "Administrative error",
  ];

  const sampleSize = Math.min(approvedPayments.length, 500);
  const selectedPayments = faker.helpers.arrayElements(
    approvedPayments,
    sampleSize
  );

  for (const payment of selectedPayments) {
    if (faker.datatype.boolean({ probability: 30 })) {
      const status = faker.helpers.arrayElement(rollbackStatuses);
      const reviewedById = status !== "pending" ? adminUser.id : null;
      const reviewedAt = status !== "pending" ? faker.date.recent({ days: 30 }) : null;

      await prisma.rollbackRequest.create({
        data: {
          payment_id: payment.id,
          requested_by_id: adminUser.id,
          reason: faker.helpers.arrayElement(rollbackReasons),
          status,
          reviewed_by_id: reviewedById,
          reviewed_at: reviewedAt,
        },
      });
    }
  }

  console.log(`Created ${sampleSize} rollback requests`);
}

async function main() {
  console.log("Starting seed...");

  console.log("Seeding users...");
  await seedUsers();

  console.log("Seeding subjects and prices...");
  const { subjectMap, priceMap, createdSubjects, createdPrices } =
    await seedSubjects();

  console.log("Seeding curriculums...");
  const curricula = await seedCurriculums(subjectMap, priceMap);

  console.log("Seeding enrollment settings...");
  await seedEnrollmentSettings(curricula);

  console.log("Seeding students...");
  await seedStudents(STUDENT_COUNT);

  console.log("Seeding enrollments and payments...");
  await seedEnrollments(curricula, new Map());

  console.log("Seeding rollback requests...");
  await seedRollbacks();

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