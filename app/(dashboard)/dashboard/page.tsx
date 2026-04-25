import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import {
  getEnrollmentTrends,
  getEnrollmentByStatus,
  getEnrollmentByGradeLevel,
  getRevenueTrends,
  getTodayCollections,
  getTotalStats,
  getRecentEnrollments,
  getRecentPayments,
  getRecentRollbackRequests,
  getEnrollmentsThisMonth,
  getTotalPaymentsCount,
} from "@/services/dashboard.service";
import { getPendingRollbackCount } from "@/services/rollback.service";
import { getPendingEnrollmentCount } from "@/services/enrollment.service";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { RegistrarDashboard } from "@/components/dashboard/registrar-dashboard";
import { CashierDashboard } from "@/components/dashboard/cashier-dashboard";

type TimeRange = 3 | 6 | 12;

function parseTimeRange(searchParams: {
  [key: string]: string | string[] | undefined;
}): TimeRange {
  const range = searchParams.range;
  if (range === "3") return 3;
  if (range === "12") return 12;
  return 6;
}

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOption);
  const params = await searchParams;
  const months = parseTimeRange(params);
  const isAdmin = session?.user?.roles?.includes("admin");
  const isRegistrar = session?.user?.roles?.includes("registrar");
  const isCashier = session?.user?.roles?.includes("cashier");

  const [totalStats, pendingRollbackCount, pendingEnrollmentCount] =
    await Promise.all([
      getTotalStats(),
      getPendingRollbackCount(),
      getPendingEnrollmentCount(),
    ]);

  if (isAdmin) {
    const [revenueTrends, recentRollbacks] = await Promise.all([
      getRevenueTrends(months),
      getRecentRollbackRequests(10),
    ]);

    return (
      <div className="p-6">
        <AdminDashboard
          revenueTrends={revenueTrends}
          recentRollbacks={recentRollbacks}
          pendingRollbackCount={pendingRollbackCount}
          stats={{
            totalStudents: totalStats.totalStudents,
            totalRevenue: totalStats.totalRevenue,
            activeUsers: totalStats.activeUsers,
          }}
        />
      </div>
    );
  }

  if (isRegistrar) {
    const [
      enrollmentTrends,
      enrollmentByStatus,
      enrollmentByGradeLevel,
      recentEnrollments,
      enrollmentsThisMonth,
    ] = await Promise.all([
      getEnrollmentTrends(months),
      getEnrollmentByStatus(),
      getEnrollmentByGradeLevel(),
      getRecentEnrollments(10),
      getEnrollmentsThisMonth(),
    ]);

    return (
      <div className="p-6">
        <RegistrarDashboard
          enrollmentTrends={enrollmentTrends}
          enrollmentByStatus={enrollmentByStatus}
          enrollmentByGradeLevel={enrollmentByGradeLevel}
          recentEnrollments={recentEnrollments}
          stats={{
            totalStudents: totalStats.totalStudents,
            enrollmentsThisMonth,
            pendingEnrollments: pendingEnrollmentCount,
          }}
        />
      </div>
    );
  }

  if (isCashier) {
    const [
      paymentTrends,
      recentPayments,
      todayCollections,
      totalPaymentsCount,
    ] = await Promise.all([
      getRevenueTrends(months),
      getRecentPayments(10),
      getTodayCollections(),
      getTotalPaymentsCount(),
    ]);

    return (
      <div className="p-6">
        <CashierDashboard
          paymentTrends={paymentTrends}
          recentPayments={recentPayments}
          stats={{
            todayCollections: todayCollections.total,
            totalRevenue: totalStats.totalRevenue,
            totalPayments: totalPaymentsCount,
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Welcome to Archivus</h1>
      <p className="text-muted-foreground mt-2">
        Your account does not have a assigned role. Please contact your
        administrator.
      </p>
    </div>
  );
}
