import prisma from "@/lib/prisma";
import {
  endOfDay,
  startOfDay,
  startOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
} from "date-fns";

export type EnrollmentTrend = {
  month: string;
  count: number;
};

export type EnrollmentByStatus = {
  status: string;
  count: number;
};

export type EnrollmentByGradeLevel = {
  gradeLevel: string;
  count: number;
};

export type RevenueTrend = {
  month: string;
  amount: number;
};

export type TodayCollection = {
  total: number;
  count: number;
};

export type TotalStats = {
  totalStudents: number;
  totalEnrollments: number;
  totalRevenue: number;
  activeUsers: number;
};

export type RecentEnrollment = {
  id: number;
  reference_code: string;
  student: {
    first_name: string;
    last_name: string;
  };
  grade_level: string;
  status: string;
  created_at: string;
};

export type RecentPayment = {
  id: number;
  receipt_no: string;
  student: {
    first_name: string;
    last_name: string;
  };
  amount_paid: number;
  payment_date: string;
};

export type RecentRollback = {
  id: number;
  student: {
    first_name: string;
    last_name: string;
  };
  amount: number;
  reason: string;
  status: string;
  created_at: string;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getMonthsInRange(months: number): string[] {
  const now = new Date();
  const result: string[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    result.push(MONTHS[date.getMonth()]);
  }
  return result;
}

export async function getEnrollmentTrends(
  months: number,
): Promise<EnrollmentTrend[]> {
  const startDate = subMonths(new Date(), months);
  startDate.setDate(1);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      created_at: { gte: startDate },
    },
    select: {
      created_at: true,
    },
  });

  const grouped: Record<string, number> = {};
  MONTHS.forEach((month) => {
    grouped[month] = 0;
  });

  enrollments.forEach((e) => {
    const month = MONTHS[e.created_at.getMonth()];
    grouped[month] = (grouped[month] || 0) + 1;
  });

  const monthsInRange = getMonthsInRange(months);
  return monthsInRange.map((month) => ({ month, count: grouped[month] || 0 }));
}

export async function getEnrollmentByStatus(): Promise<EnrollmentByStatus[]> {
  const statuses = await prisma.enrollment.groupBy({
    by: ["status"],
    _count: true,
  });

  const statusMap: Record<string, string> = {
    approved: "Approved",
    dropped: "Dropped",
  };

  return statuses.map((s) => ({
    status: statusMap[s.status] || s.status,
    count: s._count,
  }));
}

export async function getEnrollmentByGradeLevel(): Promise<
  EnrollmentByGradeLevel[]
> {
  const enrollments = await prisma.enrollment.findMany({
    where: { status: "approved" },
    include: {
      curriculum: {
        select: { grade_level: true },
      },
    },
  });

  const grouped: Record<string, number> = {};
  const gradeOrder = [
    "nursery",
    "pre-kinder",
    "kinder",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  enrollments.forEach((e) => {
    const grade = e.curriculum.grade_level;
    grouped[grade] = (grouped[grade] || 0) + 1;
  });

  return gradeOrder
    .filter((g) => grouped[g] !== undefined)
    .map((grade) => ({
      gradeLevel: grade.toUpperCase(),
      count: grouped[grade],
    }));
}

export async function getRevenueTrends(
  months: number,
): Promise<RevenueTrend[]> {
  const startDate = subMonths(new Date(), months);
  startDate.setDate(1);

  const payments = await prisma.tuitionFeePayment.findMany({
    where: {
      payment_date: { gte: startDate },
      rollback_requests: {
        none: { status: "approved" },
      },
    },
  });

  const grouped: Record<string, number> = {};
  MONTHS.forEach((month) => {
    grouped[month] = 0;
  });

  payments.forEach((p) => {
    const month = MONTHS[p.payment_date.getMonth()];
    grouped[month] = (grouped[month] || 0) + p.amount_paid.toNumber();
  });

  const monthsInRange = getMonthsInRange(months);
  return monthsInRange.map((month) => ({ month, amount: grouped[month] || 0 }));
}

export async function getTodayCollections(): Promise<TodayCollection> {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const payments = await prisma.tuitionFeePayment.findMany({
    where: {
      payment_date: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  const total = payments.reduce((sum, p) => sum + p.amount_paid.toNumber(), 0);

  return { total, count: payments.length };
}

export async function getTotalStats(): Promise<TotalStats> {
  const [totalStudents, totalEnrollments, payments, activeUsers] =
    await Promise.all([
      prisma.student.count(),
      prisma.enrollment.count({ where: { status: "approved" } }),
      prisma.tuitionFeePayment.findMany({
        where: {
          rollback_requests: {
            none: { status: "approved" },
          },
        },
      }),
      prisma.user.count(),
    ]);

  const totalRevenue = payments.reduce(
    (sum, p) => sum + p.amount_paid.toNumber(),
    0,
  );

  return { totalStudents, totalEnrollments, totalRevenue, activeUsers };
}

export async function getRecentEnrollments(
  limit = 10,
): Promise<RecentEnrollment[]> {
  const enrollments = await prisma.enrollment.findMany({
    take: limit,
    orderBy: { created_at: "desc" },
    include: {
      student: true,
      curriculum: true,
    },
  });

  return enrollments.map((e) => ({
    id: e.id,
    reference_code: e.reference_code,
    student: {
      first_name: e.student.first_name,
      last_name: e.student.last_name,
    },
    grade_level: e.curriculum.grade_level,
    status: e.status,
    created_at: e.created_at.toISOString(),
  }));
}

export async function getRecentPayments(limit = 10): Promise<RecentPayment[]> {
  const payments = await prisma.tuitionFeePayment.findMany({
    take: limit,
    orderBy: { payment_date: "desc" },
    include: {
      enrollment: {
        include: {
          student: true,
        },
      },
    },
  });

  return payments.map((p) => ({
    id: p.id,
    receipt_no: p.receipt_no,
    student: {
      first_name: p.enrollment.student.first_name,
      last_name: p.enrollment.student.last_name,
    },
    amount_paid: p.amount_paid.toNumber(),
    payment_date: p.payment_date.toISOString(),
  }));
}

export async function getRecentRollbackRequests(
  limit = 10,
): Promise<RecentRollback[]> {
  const requests = await prisma.rollbackRequest.findMany({
    take: limit,
    orderBy: { created_at: "desc" },
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
    },
  });

  return requests.map((r) => ({
    id: r.id,
    student: {
      first_name: r.payment.enrollment.student.first_name,
      last_name: r.payment.enrollment.student.last_name,
    },
    amount: r.payment.amount_paid.toNumber(),
    reason: r.reason,
    status: r.status,
    created_at: r.created_at.toISOString(),
  }));
}

export async function getEnrollmentsThisMonth(): Promise<number> {
  const startOfCurrentMonth = startOfMonth(new Date());
  const count = await prisma.enrollment.count({
    where: {
      created_at: { gte: startOfCurrentMonth },
    },
  });
  return count;
}

export async function getTotalPaymentsCount(): Promise<number> {
  return await prisma.tuitionFeePayment.count();
}
