import prisma from "@/lib/dbClient";
import { getServerSession } from "next-auth/next";
import { authOption } from "@/lib/auth";
import { RollbackStatus } from "@/app/generated/prisma/enums";

export async function createRollbackRequest(data: {
  payment_id: number;
  reason: string;
}) {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.rollbackRequest.findFirst({
    where: {
      payment_id: data.payment_id,
      status: "pending",
    },
  });

  if (existing) {
    throw new Error(
      "A pending rollback request already exists for this payment",
    );
  }

  return await prisma.rollbackRequest.create({
    data: {
      payment_id: data.payment_id,
      requested_by_id: parseInt(session.user.id),
      reason: data.reason,
    },
  });
}

export async function cancelRollbackRequest(id: number) {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const request = await prisma.rollbackRequest.findUnique({
    where: { id },
  });

  if (!request) {
    throw new Error("Rollback request not found");
  }

  if (request.requested_by_id !== parseInt(session.user.id)) {
    throw new Error("You can only cancel your own requests");
  }

  if (request.status !== "pending") {
    throw new Error("Only pending requests can be cancelled");
  }

  return await prisma.rollbackRequest.update({
    where: { id },
    data: { status: "cancelled" },
  });
}

export async function approveRollbackRequest(id: number) {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const request = await prisma.rollbackRequest.findUnique({
    where: { id },
    include: { payment: true },
  });

  if (!request) {
    throw new Error("Rollback request not found");
  }

  if (request.status !== "pending") {
    throw new Error("Only pending requests can be approved");
  }

  return await prisma.$transaction(async (tx) => {
    await tx.rollbackRequest.update({
      where: { id },
      data: {
        status: "approved",
        reviewed_by_id: parseInt(session.user.id),
        reviewed_at: new Date(),
      },
    });

    return { success: true };
  });
}

export async function denyRollbackRequest(id: number) {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const request = await prisma.rollbackRequest.findUnique({
    where: { id },
  });

  if (!request) {
    throw new Error("Rollback request not found");
  }

  if (request.status !== "pending") {
    throw new Error("Only pending requests can be denied");
  }

  return await prisma.rollbackRequest.update({
    where: { id },
    data: {
      status: "denied",
      reviewed_by_id: parseInt(session.user.id),
      reviewed_at: new Date(),
    },
  });
}

export async function getRollbackRequests(status?: string) {
  const where: { status?: RollbackStatus } = {};
  if (status && status !== "all") {
    where.status = status as RollbackStatus;
  }

  const requests = await prisma.rollbackRequest.findMany({
    where,
    include: {
      payment: {
        include: {
          enrollment: {
            include: {
              student: true,
            },
          },
        },
      },
      requested_by: {
        select: {
          id: true,
          username: true,
        },
      },
      reviewed_by: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return requests.map((request) => ({
    ...request,
    payment: {
      ...request.payment,
      amount_paid: request.payment.amount_paid.toNumber(),
      enrollment: {
        ...request.payment.enrollment,
        total_tuition_snapshot:
          request.payment.enrollment.total_tuition_snapshot.toNumber(),
        total_misc_snapshot:
          request.payment.enrollment.total_misc_snapshot.toNumber(),
      },
    },
  }));
}

export async function getPendingRollbackCount() {
  return await prisma.rollbackRequest.count({
    where: { status: "pending" },
  });
}

export async function getPaymentRollbackStatus(paymentId: number) {
  const requests = await prisma.rollbackRequest.findMany({
    where: { payment_id: paymentId },
    orderBy: { created_at: "desc" },
  });

  const pending = requests.find((r) => r.status === "pending");
  const approved = requests.find((r) => r.status === "approved");

  return {
    pending: !!pending,
    approved: !!approved,
    latestStatus: requests[0]?.status ?? null,
  };
}

export type PaymentHistoryItem = Awaited<
  ReturnType<typeof getPaymentHistory>
>[number];

export async function getPaymentHistory(enrollmentId: number) {
  const payments = await prisma.tuitionFeePayment.findMany({
    where: { enrollment_id: enrollmentId },
    orderBy: { payment_date: "desc" },
    include: {
      rollback_requests: {
        orderBy: { created_at: "desc" },
      },
    },
  });

  return payments.map((payment) => {
    const pending = payment.rollback_requests.find(
      (r) => r.status === "pending",
    );
    const approved = payment.rollback_requests.find(
      (r) => r.status === "approved",
    );

    let status: "active" | "pending" | "approved" | "denied" | "cancelled" =
      "active";
    if (approved) {
      status = "approved";
    } else if (pending) {
      status = "pending";
    } else if (payment.rollback_requests.length > 0) {
      const latest = payment.rollback_requests[0];
      status = latest.status as "denied" | "cancelled";
    }

    return {
      ...payment,
      amount_paid: payment.amount_paid.toNumber(),
      rollbackStatus: status,
      rollbackRequestId: pending?.id ?? null,
    };
  });
}
