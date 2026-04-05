import prisma from "@/lib/dbClient";
import { EnrollmentStatus, GradeLevelEnum } from "@/app/generated/prisma/enums";
import { Decimal } from "@prisma/client/runtime/client";

export type EnrollmentWithDetails = Awaited<ReturnType<typeof getEnrollment>>;

export async function getEnrollment(id: number) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: {
      student: true,
      curriculum: true,
      payments: true,
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

export type SearchEnrollmentResult = Awaited<
  ReturnType<typeof searchEnrollments>
>;

type PaymentStatus = "unpaid" | "partial" | "fully_paid";

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

export async function searchEnrollments(status?: string) {
  const where: { status?: EnrollmentStatus } = {};
  if (status && status !== "all") {
    where.status = status as EnrollmentStatus;
  }

  const enrollments = await prisma.enrollment.findMany({
    where,
    include: {
      student: true,
      curriculum: true,
      payments: true,
    },
    orderBy: { created_at: "desc" },
  });

  return enrollments.map((e) => {
    const paymentStatus = computePaymentStatus(
      e.payments,
      e.total_tuition_snapshot.toNumber(),
    );
    return {
      ...e,
      paymentStatus,
      total_tuition_snapshot: e.total_tuition_snapshot.toNumber(),
      total_misc_snapshot: e.total_misc_snapshot.toNumber(),
      curriculum: {
        ...e.curriculum,
        miscellaneous_fee: e.curriculum.miscellaneous_fee.toNumber(),
      },
      payments: e.payments.map((p: { amount_paid: Decimal }) => ({
        ...p,
        amount_paid: p.amount_paid.toNumber(),
      })),
    };
  });
}

export async function getPendingEnrollmentCount() {
  return await prisma.enrollment.count({
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
  const settings = await prisma.enrollmentSettings.findFirst();
  if (!settings) {
    throw new Error("Enrollment settings not found");
  }

  const gradeCurriculum = await prisma.gradeCurriculumSetting.findFirst({
    where: {
      grade_level: data.grade_level as GradeLevelEnum,
      school_year: data.school_year,
    },
  });

  if (!gradeCurriculum) {
    throw new Error(
      `No curriculum configured for ${data.grade_level} in ${data.school_year}`,
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
    const student = await tx.student.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        address: data.address,
        email: data.email,
      },
    });

    const enrollment = await tx.enrollment.create({
      data: {
        student_id: student.id,
        curriculum_id: curriculumId,
        school_year: data.school_year,
        status: "pending",
        total_tuition_snapshot: subjectPrices,
        total_misc_snapshot: curriculum.miscellaneous_fee,
      },
    });

    return { student, enrollment };
  });
}

export async function declineEnrollment(id: number) {
  return await prisma.enrollment.update({
    where: { id },
    data: { status: "declined" },
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
    include: { payments: true },
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
