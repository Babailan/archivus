import {
  GradeLevelEnum,
  Prisma,
  StudentVerificationStatus,
} from "@/app/generated/prisma";
import { generateNextCustomId, generateReferenceCode } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { sendReferenceCodeEmail } from "@/lib/email";

export async function createEnrollment(data: {
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: Date;
  gender: "male" | "female";
  address: string;
  email: string;
  grade_level: string;
  school_year: string;
  contact_number: string;
  lrn: string;
}) {
  const studentVerification = await prisma.studentVerification.create({
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      address: data.address,
      email: data.email,
      grade_level: data.grade_level as GradeLevelEnum,
      school_year: data.school_year,
      status: "pending",
      contact_number: data.contact_number,
      lrn: data.lrn,
    },
  });

  const referenceCode = generateReferenceCode();

  const updated = await prisma.studentVerification.update({
    where: { id: studentVerification.id },
    data: { reference_code: referenceCode },
  });

  sendReferenceCodeEmail({
    to: data.email,
    applicantName: `${data.first_name} ${data.last_name}`,
    referenceCode,
    gradeLevel: data.grade_level,
    schoolYear: data.school_year,
  });

  return updated;
}

export async function searchStudentVerifications(
  status: StudentVerificationStatus = "pending",
  page: number = 1,
  pageSize: number = 10,
  q?: string,
) {
  const skip = (page - 1) * pageSize;

  const chunks = q ? q.trim().split(/\s+/).filter(Boolean) : [];

  const searchFilter: Prisma.StudentVerificationWhereInput = q
    ? {
        OR: [
          // match full query against reference-like fields
          {
            reference_code: {
              contains: q.trim(),
            },
          },
          // match each chunk against name/email fields
          ...chunks.map((chunk) => ({
            OR: [
              { first_name: { contains: chunk } },
              { last_name: { contains: chunk } },
              {
                middle_name: { contains: chunk },
              },
              { email: { contains: chunk } },
              { lrn: { contains: chunk } },
            ],
          })),
        ],
      }
    : {};

  const where: Prisma.StudentVerificationWhereInput = {
    status,
    ...searchFilter,
  };

  const [studentVerifications, total] = await Promise.all([
    prisma.studentVerification.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { created_at: "desc" },
    }),
    prisma.studentVerification.count({ where }),
  ]);

  return { studentVerifications, total, page, pageSize };
}

export async function updateStudentVerification(
  id: number,
  data: {
    first_name: string;
    last_name: string;
    middle_name: string;
    date_of_birth: Date;
    gender: "male" | "female";
    address: string;
    email: string;
    grade_level: GradeLevelEnum;
    school_year: string;
    lrn: string;
    contact_number: string;
  },
) {
  return await prisma.studentVerification.update({
    where: { id },
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      address: data.address,
      email: data.email,
      grade_level: data.grade_level,
      school_year: data.school_year,
      lrn: data.lrn,
      contact_number: data.contact_number,
    },
  });
}

export async function approveStudentVerification(id: number) {
  const studentVerification = await prisma.studentVerification.findUnique({
    where: { id },
  });

  if (!studentVerification) {
    throw new Error("Student verification not found");
  }

  if (studentVerification.status !== "pending") {
    throw new Error("Only pending student verifications can be approved");
  }

  const gradeCurriculum = await prisma.gradeCurriculumSetting.findFirst({
    where: {
      grade_level: studentVerification.grade_level,
      school_year: studentVerification.school_year,
    },
  });

  if (!gradeCurriculum) {
    throw new Error(
      `No curriculum configured for ${studentVerification.grade_level} in ${studentVerification.school_year}`,
    );
  }

  const curriculumId = gradeCurriculum.curriculum_id;

  const curriculum = await prisma.curriculum.findUnique({
    where: { id: curriculumId },
    include: {
      curriculum_subjects: {
        include: {
          subject_price: true,
        },
      },
    },
  });

  if (!curriculum) {
    throw new Error("Curriculum not found");
  }

  const subjectPrices = curriculum.curriculum_subjects.reduce(
    (sum, cs) => sum.add(cs.subject_price.price),
    curriculum.miscellaneous_fee,
  );

  return await prisma.$transaction(async (tx) => {
    // 1. Generate Custom Student ID
    const year = studentVerification.school_year.split("-")[0]; // e.g., "2024" from "2024-2025"
    const lastStudent = await tx.student.findFirst({
      where: { id: { gte: parseInt(year) * 100000 } },
      orderBy: { id: "desc" },
    });
    const nextStudentId = generateNextCustomId(
      year,
      lastStudent ? lastStudent.id : null,
    );

    // 2. Create Student
    const student = await tx.student.create({
      data: {
        id: nextStudentId,
        first_name: studentVerification.first_name,
        last_name: studentVerification.last_name,
        middle_name: studentVerification.middle_name,
        date_of_birth: studentVerification.date_of_birth,
        gender: studentVerification.gender,
        address: studentVerification.address,
        email: studentVerification.email,
        contact_number: studentVerification.contact_number,
        lrn: studentVerification.lrn,
      },
    });

    // 3. Create Enrollment
    const enrollment = await tx.enrollment.create({
      data: {
        student_id: student.id,
        curriculum_id: curriculumId,
        school_year: studentVerification.school_year,
        status: "approved",
        total_tuition_snapshot: subjectPrices,
        total_misc_snapshot: curriculum.miscellaneous_fee,
        reference_code: generateReferenceCode(),
      },
    });

    // 4. Update Student Verification status
    await tx.studentVerification.update({
      where: { id },
      data: { status: "approved" },
    });

    return {
      student,
      enrollment: {
        ...enrollment,
        total_tuition_snapshot: enrollment.total_tuition_snapshot.toNumber(),
        total_misc_snapshot: enrollment.total_misc_snapshot.toNumber(),
        min_partial_payment_override:
          enrollment.min_partial_payment_override?.toNumber() ?? null,
      },
    };
  });
}

export async function declineStudentVerification(id: number) {
  return await prisma.studentVerification.update({
    where: { id },
    data: { status: "declined" },
  });
}

export async function getStudentVerificationById(id: number) {
  const studentVerification = await prisma.studentVerification.findUnique({
    where: { id },
  });
  if (!studentVerification) {
    throw new Error("Student verification not found");
  }
  return studentVerification;
}
