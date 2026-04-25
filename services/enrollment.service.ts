import prisma from "@/lib/prisma";
import {
  EnrollmentStatus,
  GradeLevelEnum,
  Prisma,
} from "@/app/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import {
  generateReferenceCode,
  generateNextCustomId,
} from "@/lib/helper";

export type EnrollmentWithDetails = Awaited<ReturnType<typeof getEnrollment>>;

export async function getEnrollment(id: number) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: {
      student: true,
      curriculum: true,
      payments: {
        where: {
          NOT: {
            rollback_requests: {
              some: { status: "approved" },
            },
          },
        },
      },
    },
  });

  if (!enrollment) return null;

  const paymentStatus = computePaymentStatus(
    enrollment.payments,
    enrollment.total_tuition_snapshot.toNumber(),
  );

  return {
    ...enrollment,
    paymentStatus,
    total_tuition_snapshot: enrollment.total_tuition_snapshot.toNumber(),
    total_misc_snapshot: enrollment.total_misc_snapshot.toNumber(),
    min_partial_payment_override:
      enrollment.min_partial_payment_override?.toNumber() ?? null,
    curriculum: {
      ...enrollment.curriculum,
      miscellaneous_fee: enrollment.curriculum.miscellaneous_fee.toNumber(),
    },
    payments: enrollment.payments.map((p: { amount_paid: Decimal }) => ({
      ...p,
      amount_paid: p.amount_paid.toNumber(),
    })),
  };
}

export type SearchEnrollmentResult = {
  enrollments: EnrollmentItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type PaymentStatus = "unpaid" | "partial" | "fully_paid";

export type EnrollmentItem = {
  id: number;
  student: {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
  };
  curriculum: {
    id: number;
    grade_level: string;
    curriculum_name: string;
    curriculum_code: string;
    miscellaneous_fee: number;
  };
  school_year: string;
  status: EnrollmentStatus;
  total_tuition_snapshot: number;
  total_misc_snapshot: number;
  paymentStatus: PaymentStatus;
  payments: Array<{ amount_paid: number }>;
  created_at: Date;
};

function computePaymentStatus(
  payments: { amount_paid: Decimal }[],
  totalTuition: number,
): PaymentStatus {
  const totalPaid = payments.reduce(
    (sum, p) => sum + p.amount_paid.toNumber(),
    0,
  );
  if (totalPaid >= totalTuition) {
    return "fully_paid";
  } else if (totalPaid > 0) {
    return "partial";
  }
  return "unpaid";
}

export async function searchEnrollments(
  status?: string,
  q?: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const where: Prisma.EnrollmentWhereInput = {};
  if (status && status !== "all") {
    where.status = status as EnrollmentStatus;
  }

  if (q) {
    const chunks = q.trim().split(/\s+/).filter(Boolean);
    if (chunks.length > 0) {
      where.AND = chunks.map((chunk) => {
        const searchConditions: Prisma.EnrollmentWhereInput[] = [
          { reference_code: { contains: chunk } },
          { student: { first_name: { contains: chunk } } },
          { student: { last_name: { contains: chunk } } },
          { student: { middle_name: { contains: chunk } } },
          { student: { email: { contains: chunk } } },
          { school_year: { contains: chunk } },
          { curriculum: { curriculum_name: { contains: chunk } } },
        ];

        if (/^\d+$/.test(chunk)) {
          searchConditions.push({ student_id: parseInt(chunk) });
        }

        return { OR: searchConditions };
      });
    }
  }

  const skip = (page - 1) * pageSize;

  const [enrollments, total] = await Promise.all([
    prisma.enrollment.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        student: true,
        curriculum: true,
        payments: {
          where: {
            NOT: {
              rollback_requests: {
                some: { status: "approved" },
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.enrollment.count({ where }),
  ]);

  return {
    enrollments: enrollments.map((e) => {
      const paymentStatus = computePaymentStatus(
        e.payments,
        e.total_tuition_snapshot.toNumber(),
      );
      return {
        ...e,
        paymentStatus,
        total_tuition_snapshot: e.total_tuition_snapshot.toNumber(),
        total_misc_snapshot: e.total_misc_snapshot.toNumber(),
        min_partial_payment_override:
          e.min_partial_payment_override?.toNumber() ?? null,
        curriculum: {
          ...e.curriculum,
          miscellaneous_fee: e.curriculum.miscellaneous_fee.toNumber(),
        },
        payments: e.payments.map((p: { amount_paid: Decimal }) => ({
          ...p,
          amount_paid: p.amount_paid.toNumber(),
        })),
      };
    }),
    total,
    page,
    pageSize,
  };
}

export async function getPreEnrollments(
  status: EnrollmentStatus = "pending",
  page: number = 1,
  pageSize: number = 10,
) {
  const skip = (page - 1) * pageSize;
  const [preEnrollments, total] = await Promise.all([
    prisma.preEnrollment.findMany({
      where: { status },
      skip,
      take: pageSize,
      orderBy: { created_at: "desc" },
    }),
    prisma.preEnrollment.count({ where: { status } }),
  ]);

  return { preEnrollments, total, page, pageSize };
}

export async function searchStudents(
  q?: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const skip = (page - 1) * pageSize;
  const where: Prisma.StudentWhereInput = {};

  if (q) {
    const chunks = q.trim().split(/\s+/).filter(Boolean);
    if (chunks.length > 0) {
      where.AND = chunks.map((chunk) => ({
        OR: [
          { first_name: { contains: chunk } },
          { last_name: { contains: chunk } },
          { middle_name: { contains: chunk } },
          { email: { contains: chunk } },
        ],
      }));
    }
  }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        enrollments: {
          orderBy: { created_at: "desc" },
          take: 1,
          include: { curriculum: true },
        },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.student.count({ where }),
  ]);

  return {
    students: students.map((s) => ({
      ...s,
      enrollments: s.enrollments.map((e) => ({
        ...e,
        total_tuition_snapshot: e.total_tuition_snapshot.toNumber(),
        total_misc_snapshot: e.total_misc_snapshot.toNumber(),
        min_partial_payment_override:
          e.min_partial_payment_override?.toNumber() ?? null,
        curriculum: {
          ...e.curriculum,
          miscellaneous_fee: e.curriculum.miscellaneous_fee.toNumber(),
        },
      })),
    })),
    total,
    page,
    pageSize,
  };
}

export async function getPendingEnrollmentCount() {
  return await prisma.preEnrollment.count({
    where: { status: "pending" },
  });
}

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
}) {
  return await prisma.preEnrollment.create({
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
    },
  });
}

export async function approvePreEnrollment(id: number) {
  const preEnrollment = await prisma.preEnrollment.findUnique({
    where: { id },
  });

  if (!preEnrollment) {
    throw new Error("Pre-enrollment not found");
  }

  if (preEnrollment.status !== "pending") {
    throw new Error("Only pending pre-enrollments can be approved");
  }

  const gradeCurriculum = await prisma.gradeCurriculumSetting.findFirst({
    where: {
      grade_level: preEnrollment.grade_level,
      school_year: preEnrollment.school_year,
    },
  });

  if (!gradeCurriculum) {
    throw new Error(
      `No curriculum configured for ${preEnrollment.grade_level} in ${preEnrollment.school_year}`,
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
    const year = preEnrollment.school_year.split("-")[0]; // e.g., "2024" from "2024-2025"
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
        first_name: preEnrollment.first_name,
        last_name: preEnrollment.last_name,
        middle_name: preEnrollment.middle_name,
        date_of_birth: preEnrollment.date_of_birth,
        gender: preEnrollment.gender,
        address: preEnrollment.address,
        email: preEnrollment.email,
      },
    });

    // 3. Create Enrollment
    const enrollment = await tx.enrollment.create({
      data: {
        student_id: student.id,
        curriculum_id: curriculumId,
        school_year: preEnrollment.school_year,
        status: "approved",
        total_tuition_snapshot: subjectPrices,
        total_misc_snapshot: curriculum.miscellaneous_fee,
        reference_code: generateReferenceCode(
          preEnrollment.school_year,
          student.id,
        ),
      },
    });

    // 4. Update Pre-Enrollment status
    await tx.preEnrollment.update({
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

export async function declinePreEnrollment(id: number) {
  return await prisma.preEnrollment.update({
    where: { id },
    data: { status: "declined" },
  });
}

export async function dropEnrollment(id: number) {
  return await prisma.enrollment.update({
    where: { id },
    data: { status: "dropped" },
  });
}

export async function declineEnrollment(id: number) {
  return await prisma.enrollment.update({
    where: { id },
    data: { status: "declined" },
  });
}

export async function getStudentByEnrollmentId(id: number) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: {
      student: true,
      curriculum: true,
      payments: {
        where: {
          NOT: {
            rollback_requests: {
              some: { status: "approved" },
            },
          },
        },
      },
    },
  });

  if (!enrollment) return null;

  const totalPaid = enrollment.payments.reduce(
    (sum, p) => sum.add(p.amount_paid),
    new Decimal(0),
  );
  const totalTuition = enrollment.total_tuition_snapshot.toNumber();
  const balance = totalTuition - totalPaid.toNumber();

  return {
    student: {
      ...enrollment.student,
      date_of_birth: enrollment.student.date_of_birth
        .toISOString()
        .split("T")[0],
    },
    enrollment: {
      id: enrollment.id,
      reference_code: enrollment.reference_code,
      school_year: enrollment.school_year,
      status: enrollment.status,
      grade_level: enrollment.curriculum.grade_level,
      total_tuition_snapshot: totalTuition,
      total_misc_snapshot: enrollment.total_misc_snapshot.toNumber(),
      min_partial_payment_override:
        enrollment.min_partial_payment_override?.toNumber() ?? null,
      payment_status:
        balance <= 0
          ? "fully_paid"
          : totalPaid.gt(new Decimal(0))
            ? "partial"
            : "unpaid",
      total_paid: totalPaid.toNumber(),
      balance,
    },
  };
}

export async function updateStudent(data: {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string;
  address: string;
  gender: "male" | "female";
  email: string;
}) {
  return await prisma.student.update({
    where: { id: data.id },
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name,
      date_of_birth: new Date(data.date_of_birth),
      address: data.address,
      gender: data.gender,
      email: data.email,
    },
  });
}

export async function approveEnrollment(id: number) {
  return await prisma.enrollment.update({
    where: { id },
    data: { status: "approved" },
  });
}

export async function recordPayment(data: {
  enrollment_id: number;
  amount_paid: number;
  receipt_no: string;
}) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: data.enrollment_id },
    include: {
      payments: {
        where: {
          NOT: {
            rollback_requests: {
              some: { status: "approved" },
            },
          },
        },
      },
    },
  });

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const totalPaid = enrollment.payments.reduce(
    (sum, p) => sum.add(p.amount_paid),
    new Decimal(0),
  );

  const newTotalPaid = totalPaid.add(data.amount_paid);
  const isFullyPaid = newTotalPaid.gte(enrollment.total_tuition_snapshot);

  await prisma.tuitionFeePayment.create({
    data: {
      enrollment_id: data.enrollment_id,
      amount_paid: data.amount_paid,
      receipt_no: data.receipt_no,
    },
  });

  return { isFullyPaid };
}
