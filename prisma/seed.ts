import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { generateReferenceCode } from "@/lib/helper";

const generateStudents = (count: number) => {
  const students = [];
  for (let i = 0; i < count; i++) {
    students.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      middle_name: faker.person.middleName(),
      date_of_birth: faker.date.birthdate({ min: 5, max: 12, mode: "age" }),
      address: faker.location.streetAddress(),
      gender: faker.helpers.arrayElement(["male", "female"]),
      email: faker.internet.email(),
    });
  }
  return students;
};

const generatePayment = (amount: number) => {
  const payments = [];
  let remaining = amount;
  const paymentCount = faker.number.int({ min: 1, max: 3 });

  for (let i = 0; i < paymentCount; i++) {
    if (i === paymentCount - 1 || remaining <= 1000) {
      payments.push({
        amount_paid: remaining,
        receipt_no: `RCP-${faker.string.alphanumeric(8).toUpperCase()}`,
        payment_date: faker.date.between({
          from: new Date("2025-01-01"),
          to: new Date("2025-06-30"),
        }),
      });
      remaining = 0;
    } else {
      const maxAmount = Math.min(remaining - 1000, 5000);
      const paymentAmount = faker.number.int({
        min: 1000,
        max: Math.max(1000, maxAmount),
      });
      payments.push({
        amount_paid: paymentAmount,
        receipt_no: `RCP-${faker.string.alphanumeric(8).toUpperCase()}`,
        payment_date: faker.date.between({
          from: new Date("2025-01-01"),
          to: new Date("2025-06-30"),
        }),
      });
      remaining -= paymentAmount;
    }
  }
  return payments;
};

async function main() {
  const salt = await bcrypt.genSalt(10);
  const existingUser = await prisma.user.findUnique({
    where: { username: "babi" },
  });
  if (!existingUser) {
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
  }

  const existingSubjects = await prisma.subject.findMany({
    where: {
      subject_code: {
        in: [
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
    },
  });

  let subjects = existingSubjects;
  if (existingSubjects.length < 8) {
    subjects = await Promise.all([
      prisma.subject.create({
        data: { subject_code: "MATH-101", subject_name: "Mathematics" },
      }),
      prisma.subject.create({
        data: { subject_code: "ENG-101", subject_name: "English" },
      }),
      prisma.subject.create({
        data: { subject_code: "SCI-101", subject_name: "Science" },
      }),
      prisma.subject.create({
        data: { subject_code: "FIL-101", subject_name: "Filipino" },
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
        data: { subject_code: "SS-101", subject_name: "Social Studies" },
      }),
      prisma.subject.create({
        data: {
          subject_code: "TLE-101",
          subject_name: "Technology and Livelihood Education",
        },
      }),
    ]);
  }

  const subjectMap = new Map(subjects.map((s) => [s.subject_code, s.id]));

  const existingSubjectPrices = await prisma.subjectPrice.findMany({
    where: {
      subject_id: { in: Array.from(subjectMap.values()) },
    },
  });

  let subjectPrices = existingSubjectPrices;
  if (subjectPrices.length < 8) {
    subjectPrices = await Promise.all([
      prisma.subjectPrice.create({
        data: { subject_id: subjectMap.get("MATH-101")!, price: 1500 },
      }),
      prisma.subjectPrice.create({
        data: { subject_id: subjectMap.get("ENG-101")!, price: 1500 },
      }),
      prisma.subjectPrice.create({
        data: { subject_id: subjectMap.get("SCI-101")!, price: 1750 },
      }),
      prisma.subjectPrice.create({
        data: { subject_id: subjectMap.get("FIL-101")!, price: 1250 },
      }),
      prisma.subjectPrice.create({
        data: { subject_id: subjectMap.get("MAPEH-101")!, price: 1250 },
      }),
      prisma.subjectPrice.create({
        data: { subject_id: subjectMap.get("CLE-101")!, price: 1000 },
      }),
      prisma.subjectPrice.create({
        data: { subject_id: subjectMap.get("SS-101")!, price: 1250 },
      }),
      prisma.subjectPrice.create({
        data: { subject_id: subjectMap.get("TLE-101")!, price: 1500 },
      }),
    ]);
  }

  const curriculum1 = await prisma.curriculum.upsert({
    where: { curriculum_code: "K-12-G1-2024" },
    update: {},
    create: {
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

  const curriculum2 = await prisma.curriculum.upsert({
    where: { curriculum_code: "K-12-G2-2024" },
    update: {},
    create: {
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

  const curriculum3 = await prisma.curriculum.upsert({
    where: { curriculum_code: "K-12-G3-2024" },
    update: {},
    create: {
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

  const curriculum4 = await prisma.curriculum.upsert({
    where: { curriculum_code: "K-12-G4-2024" },
    update: {},
    create: {
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

  const existingSettings2025 = await prisma.enrollmentSettings.findFirst({
    where: { school_year: "2025-2026" },
  });

  if (!existingSettings2025) {
    await prisma.gradeCurriculumSetting.createMany({
      data: [
        {
          school_year: "2025-2026",
          grade_level: "grade1",
          curriculum_id: curriculum1.id,
        },
        {
          school_year: "2025-2026",
          grade_level: "grade2",
          curriculum_id: curriculum2.id,
        },
        {
          school_year: "2025-2026",
          grade_level: "grade3",
          curriculum_id: curriculum3.id,
        },
        {
          school_year: "2025-2026",
          grade_level: "grade4",
          curriculum_id: curriculum4.id,
        },
      ],
    });
  }

  const existingAdditionalSubjects = await prisma.subject.findMany({
    where: {
      subject_code: {
        in: [
          "COMP-101",
          "HIST-101",
          "AP-101",
          "ESP-101",
          "PE-101",
          "MUS-101",
          "ART-101",
        ],
      },
    },
  });

  let additionalSubjects = existingAdditionalSubjects;
  if (existingAdditionalSubjects.length < 7) {
    additionalSubjects = await Promise.all([
      prisma.subject.create({
        data: { subject_code: "COMP-101", subject_name: "Computer Education" },
      }),
      prisma.subject.create({
        data: { subject_code: "HIST-101", subject_name: "History" },
      }),
      prisma.subject.create({
        data: { subject_code: "AP-101", subject_name: "Araling Panlipunan" },
      }),
      prisma.subject.create({
        data: {
          subject_code: "ESP-101",
          subject_name: "Edukasyon sa Pagpapakatao",
        },
      }),
      prisma.subject.create({
        data: { subject_code: "PE-101", subject_name: "Physical Education" },
      }),
      prisma.subject.create({
        data: { subject_code: "MUS-101", subject_name: "Music" },
      }),
      prisma.subject.create({
        data: { subject_code: "ART-101", subject_name: "Art" },
      }),
    ]);
  }

  const additionalSubjectMap = new Map(
    additionalSubjects.map((s) => [s.subject_code, s.id]),
  );

  const existingAdditionalSubjectPrices = await prisma.subjectPrice.findMany({
    where: {
      subject_id: { in: Array.from(additionalSubjectMap.values()) },
    },
  });

  let additionalSubjectPrices = existingAdditionalSubjectPrices;
  if (additionalSubjectPrices.length < 7) {
    additionalSubjectPrices = await Promise.all([
      prisma.subjectPrice.create({
        data: {
          subject_id: additionalSubjectMap.get("COMP-101")!,
          price: 1500,
        },
      }),
      prisma.subjectPrice.create({
        data: {
          subject_id: additionalSubjectMap.get("HIST-101")!,
          price: 1200,
        },
      }),
      prisma.subjectPrice.create({
        data: { subject_id: additionalSubjectMap.get("AP-101")!, price: 1200 },
      }),
      prisma.subjectPrice.create({
        data: { subject_id: additionalSubjectMap.get("ESP-101")!, price: 1000 },
      }),
      prisma.subjectPrice.create({
        data: { subject_id: additionalSubjectMap.get("PE-101")!, price: 800 },
      }),
      prisma.subjectPrice.create({
        data: { subject_id: additionalSubjectMap.get("MUS-101")!, price: 1000 },
      }),
      prisma.subjectPrice.create({
        data: { subject_id: additionalSubjectMap.get("ART-101")!, price: 1000 },
      }),
    ]);
  }

  const curriculum5 = await prisma.curriculum.upsert({
    where: { curriculum_code: "K-12-G5-2024" },
    update: {},
    create: {
      curriculum_code: "K-12-G5-2024",
      curriculum_name: "Grade 5 Curriculum 2024",
      grade_level: "grade5",
      miscellaneous_fee: 2800,
      curriculum_subjects: {
        create: [...subjectPrices.slice(0, 7), additionalSubjectPrices[0]].map(
          (sp, index) => ({
            subject_id:
              index < subjects.length
                ? subjects[index].id
                : additionalSubjects[0].id,
            subject_price_id: sp.id,
          }),
        ),
      },
    },
  });

  const curriculum6 = await prisma.curriculum.upsert({
    where: { curriculum_code: "K-12-G6-2024" },
    update: {},
    create: {
      curriculum_code: "K-12-G6-2024",
      curriculum_name: "Grade 6 Curriculum 2024",
      grade_level: "grade6",
      miscellaneous_fee: 3000,
      curriculum_subjects: {
        create: [
          ...subjectPrices.slice(0, 7),
          additionalSubjectPrices[0],
          additionalSubjectPrices[1],
        ].map((sp, index) => ({
          subject_id:
            index < subjects.length
              ? subjects[index].id
              : additionalSubjects[index - 7].id,
          subject_price_id: sp.id,
        })),
      },
    },
  });

  const allCurricula = [
    curriculum1,
    curriculum2,
    curriculum3,
    curriculum4,
    curriculum5,
    curriculum6,
  ];

  const createdStudents = await prisma.student.findMany({
    take: 25,
    orderBy: { id: "desc" },
  });

  const enrollmentStatuses = [
    "pending",
    "approved",
    "declined",
    "dropped",
  ] as const;
  const createdEnrollments = [];

  for (const student of createdStudents) {
    const curriculum = faker.helpers.arrayElement(allCurricula);
    const curriculumSubjects = await prisma.curriculumSubjects.findMany({
      where: { curriculum_id: curriculum.id },
      include: { subject_price: true },
    });

    const totalTuition = curriculumSubjects.reduce(
      (sum, cs) => sum + Number(cs.subject_price.price),
      0,
    );
    const totalMisc = Number(curriculum.miscellaneous_fee);
    const totalAmount = totalTuition + totalMisc;

    const status = faker.helpers.arrayElement(enrollmentStatuses);

    const enrollment = await prisma.enrollment.create({
      data: {
        student_id: student.id,
        curriculum_id: curriculum.id,
        school_year: "2025-2026",
        status,
        total_tuition_snapshot: totalTuition,
        total_misc_snapshot: totalMisc,
        reference_code: generateReferenceCode("2025-2026", student.id),
      },
    });
    createdEnrollments.push({ enrollment, totalAmount, status });
  }

  for (const { enrollment, totalAmount, status } of createdEnrollments) {
    if (status === "approved") {
      const isFullyPaid = faker.datatype.boolean();
      const payments = isFullyPaid
        ? generatePayment(totalAmount)
        : generatePayment(
            faker.number.int({
              min: 1000,
              max: Math.max(1000, totalAmount - 500),
            }),
          );

      for (const payment of payments) {
        await prisma.tuitionFeePayment.create({
          data: {
            enrollment_id: enrollment.id,
            amount_paid: payment.amount_paid,
            receipt_no: payment.receipt_no,
            payment_date: payment.payment_date,
          },
        });
      }
    }
  }

  const createdMoreStudents = await prisma.student.findMany({
    take: 15,
    skip: 25,
    orderBy: { id: "desc" },
  });

  for (const student of createdMoreStudents) {
    const curriculum = faker.helpers.arrayElement(allCurricula);
    const curriculumSubjects = await prisma.curriculumSubjects.findMany({
      where: { curriculum_id: curriculum.id },
      include: { subject_price: true },
    });

    const totalTuition = curriculumSubjects.reduce(
      (sum, cs) => sum + Number(cs.subject_price.price),
      0,
    );
    const totalMisc = Number(curriculum.miscellaneous_fee);
    const totalAmount = totalTuition + totalMisc;

    const status = faker.helpers.arrayElement(enrollmentStatuses);

    const enrollment = await prisma.enrollment.create({
      data: {
        student_id: student.id,
        curriculum_id: curriculum.id,
        school_year: "2025-2026",
        status,
        total_tuition_snapshot: totalTuition,
        total_misc_snapshot: totalMisc,
        reference_code:generateReferenceCode("2025-2026", student.id),
      },
    });

    if (status === "approved") {
      const isFullyPaid = faker.datatype.boolean();
      const payments = isFullyPaid
        ? generatePayment(totalAmount)
        : generatePayment(
            faker.number.int({
              min: 1000,
              max: Math.max(1000, totalAmount - 500),
            }),
          );

      for (const payment of payments) {
        await prisma.tuitionFeePayment.create({
          data: {
            enrollment_id: enrollment.id,
            amount_paid: payment.amount_paid,
            receipt_no: payment.receipt_no,
            payment_date: payment.payment_date,
          },
        });
      }
    }
  }

  const existingSettings2026 = await prisma.enrollmentSettings.findFirst({
    where: { school_year: "2026-2027" },
  });

  if (!existingSettings2026) {
    await prisma.enrollmentSettings.create({
      data: {
        school_year: "2026-2027",
        is_online_enrollment_enabled: true,
      },
    });
    await prisma.gradeCurriculumSetting.createMany({
      data: [
        {
          school_year: "2026-2027",
          grade_level: "grade1",
          curriculum_id: curriculum1.id,
        },
        {
          school_year: "2026-2027",
          grade_level: "grade2",
          curriculum_id: curriculum2.id,
        },
        {
          school_year: "2026-2027",
          grade_level: "grade3",
          curriculum_id: curriculum3.id,
        },
        {
          school_year: "2026-2027",
          grade_level: "grade4",
          curriculum_id: curriculum4.id,
        },
        {
          school_year: "2026-2027",
          grade_level: "grade5",
          curriculum_id: curriculum5.id,
        },
        {
          school_year: "2026-2027",
          grade_level: "grade6",
          curriculum_id: curriculum6.id,
        },
      ],
    });
  }

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
