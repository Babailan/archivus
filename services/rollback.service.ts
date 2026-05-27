import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOption } from "@/lib/auth";
import { RollbackStatus } from "@/app/generated/prisma/enums";
import { EnrollmentStatus } from "@/app/generated/prisma/enums";

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

export async function getRollbackRequests(
  status?: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const where: { status?: RollbackStatus } = {};
  if (status && status !== "all") {
    where.status = status as RollbackStatus;
  }

  const skip = (page - 1) * pageSize;

  const [requests, total] = await Promise.all([
    prisma.rollbackRequest.findMany({
      where,
      skip,
      take: pageSize,
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
            first_name: true,
            last_name: true,
            middle_name: true,
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
    }),
    prisma.rollbackRequest.count({ where }),
  ]);

  return {
    requests: requests.map((request) => ({
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
    })),
    total,
    page,
    pageSize,
  };
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

export async function createEnrollmentRollbackRequest(data: {
  enrollment_id: number;
  reason: string;
}) {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: data.enrollment_id },
  });

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  if (enrollment.status !== "approved") {
    throw new Error("Only approved enrollments can have a rollback request");
  }

  const existing = await prisma.enrollmentRollbackRequest.findFirst({
    where: {
      enrollment_id: data.enrollment_id,
      status: "pending",
    },
  });

  if (existing) {
    throw new Error(
      "A pending rollback request already exists for this enrollment",
    );
  }

  return await prisma.enrollmentRollbackRequest.create({
    data: {
      enrollment_id: data.enrollment_id,
      requested_by_id: parseInt(session.user.id),
      reason: data.reason,
    },
  });
}

export async function cancelEnrollmentRollbackRequest(id: number) {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const request = await prisma.enrollmentRollbackRequest.findUnique({
    where: { id },
  });

  if (!request) {
    throw new Error("Enrollment rollback request not found");
  }

  if (request.requested_by_id !== parseInt(session.user.id)) {
    throw new Error("You can only cancel your own requests");
  }

  if (request.status !== "pending") {
    throw new Error("Only pending requests can be cancelled");
  }

  return await prisma.enrollmentRollbackRequest.update({
    where: { id },
    data: { status: "cancelled" },
  });
}

export async function approveEnrollmentRollbackRequest(id: number) {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const request = await prisma.enrollmentRollbackRequest.findUnique({
    where: { id },
    include: { enrollment: true },
  });

  if (!request) {
    throw new Error("Enrollment rollback request not found");
  }

  if (request.status !== "pending") {
    throw new Error("Only pending requests can be approved");
  }

  return await prisma.$transaction(async (tx) => {
    await tx.enrollmentRollbackRequest.update({
      where: { id },
      data: {
        status: "approved",
        reviewed_by_id: parseInt(session.user.id),
        reviewed_at: new Date(),
      },
    });

    await tx.enrollment.update({
      where: { id: request.enrollment_id },
      data: { status: "cancelled" as EnrollmentStatus },
    });

    return { success: true };
  });
}

export async function denyEnrollmentRollbackRequest(id: number) {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const request = await prisma.enrollmentRollbackRequest.findUnique({
    where: { id },
  });

  if (!request) {
    throw new Error("Enrollment rollback request not found");
  }

  if (request.status !== "pending") {
    throw new Error("Only pending requests can be denied");
  }

  return await prisma.enrollmentRollbackRequest.update({
    where: { id },
    data: {
      status: "denied",
      reviewed_by_id: parseInt(session.user.id),
      reviewed_at: new Date(),
    },
  });
}

export async function getEnrollmentRollbackRequests(
  status?: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const where: { status?: RollbackStatus } = {};
  if (status && status !== "all") {
    where.status = status as RollbackStatus;
  }

  const skip = (page - 1) * pageSize;

  const [requests, total] = await Promise.all([
    prisma.enrollmentRollbackRequest.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        enrollment: {
          include: {
            student: true,
            curriculum: true,
          },
        },
        requested_by: {
          select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            middle_name: true,
          },
        },
        reviewed_by: {
          select: { id: true, username: true },
        },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.enrollmentRollbackRequest.count({ where }),
  ]);

  return {
    requests: requests.map((r) => ({
      ...r,
      enrollment: {
        ...r.enrollment,
        total_tuition_snapshot: r.enrollment.total_tuition_snapshot.toNumber(),
        total_misc_snapshot: r.enrollment.total_misc_snapshot.toNumber(),
      },
    })),
    total,
    page,
    pageSize,
  };
}

export async function getPendingEnrollmentRollbackCount() {
  return await prisma.enrollmentRollbackRequest.count({
    where: { status: "pending" },
  });
}

export async function getEnrollmentRollbackStatus(enrollmentId: number) {
  const requests = await prisma.enrollmentRollbackRequest.findMany({
    where: { enrollment_id: enrollmentId },
    orderBy: { created_at: "desc" },
  });

  const pending = requests.find((r) => r.status === "pending");
  const approved = requests.find((r) => r.status === "approved");

  return {
    hasPendingRequest: !!pending,
    wasApproved: !!approved,
    pendingRequestId: pending?.id ?? null,
    latestStatus: requests[0]?.status ?? null,
  };
}
