import prisma from "@/lib/dbClient";
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

export type ApprovedEnrollment = Awaited<
  ReturnType<typeof getApprovedEnrollments>
>[number];

export async function getApprovedEnrollments(q?: string) {
  const where: any = {
    status: "approved",
  };

  if (q) {
    where.OR = [
      { student: { last_name: { search: q + "*" } } },
      { student: { first_name: { search: q + "*" } } },
    ];
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
    const totalPaid = e.payments.reduce(
      (sum, p) => sum + p.amount_paid.toNumber(),
      0,
    );
    const paymentStatus = computePaymentStatus(
      e.payments,
      e.total_tuition_snapshot.toNumber(),
    );
    return {
      id: e.id,
      student: {
        first_name: e.student.first_name,
        last_name: e.student.last_name,
      },
      grade_level: e.curriculum.grade_level,
      school_year: e.school_year,
      total_tuition: e.total_tuition_snapshot.toNumber(),
      total_paid: totalPaid,
      balance: e.total_tuition_snapshot.toNumber() - totalPaid,
      paymentStatus,
    };
  });
}
