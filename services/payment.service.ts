import { EnrollmentWhereInput } from "@/app/generated/prisma/models";
import { GradeLevelEnum } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/client";

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

export type ApprovedEnrollment = {
  id: number;
  student: { first_name: string; last_name: string };
  grade_level: GradeLevelEnum;
  school_year: string;
  total_tuition: number;
  total_paid: number;
  balance: number;
  paymentStatus: PaymentStatus;
  min_partial_payment: number;
};

export type PaymentsResult = Awaited<
  ReturnType<typeof getApprovedEnrollments>
>;

export async function getApprovedEnrollments(
  q?: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const where: EnrollmentWhereInput = {
    status: "approved",
  };

  if (q) {
    where.OR = [
      { student: { last_name: { contains: q } } },
      { student: { first_name: { contains: q } } },
    ];
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
      const totalPaid = e.payments.reduce(
        (sum, p) => sum + p.amount_paid.toNumber(),
        0,
      );
      const totalTuition = e.total_tuition_snapshot.toNumber();
      const paymentStatus = computePaymentStatus(e.payments, totalTuition);
      const minPartialPayment =
        e.min_partial_payment_override != null
          ? e.min_partial_payment_override.toNumber()
          : totalTuition * 0.2;
      return {
        id: e.id,
        student: {
          first_name: e.student.first_name,
          last_name: e.student.last_name,
        },
        grade_level: e.curriculum.grade_level,
        school_year: e.school_year,
        total_tuition: totalTuition,
        total_paid: totalPaid,
        balance: totalTuition - totalPaid,
        paymentStatus,
        min_partial_payment: minPartialPayment,
      };
    }),
    total,
    page,
    pageSize,
  };
}
