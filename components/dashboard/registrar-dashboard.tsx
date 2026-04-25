"use client";

import { Suspense } from "react";
import { StatCard } from "./stat-card";
import { TimeRangeSelector } from "./time-range-selector";
import { EnrollmentBarChart } from "./charts/enrollment-bar-chart";
import { EnrollmentPieChart } from "./charts/enrollment-pie-chart";
import { GradeBarChart } from "./charts/grade-bar-chart";
import { RecentEnrollmentsTable } from "./tables/recent-enrollments-table";
import type {
  EnrollmentTrend,
  EnrollmentByStatus,
  EnrollmentByGradeLevel,
  RecentEnrollment,
} from "@/services/dashboard.service";

type Props = {
  enrollmentTrends: EnrollmentTrend[];
  enrollmentByStatus: EnrollmentByStatus[];
  enrollmentByGradeLevel: EnrollmentByGradeLevel[];
  recentEnrollments: RecentEnrollment[];
  stats: {
    totalStudents: number;
    enrollmentsThisMonth: number;
    pendingEnrollments: number;
  };
};

export function RegistrarDashboard({
  enrollmentTrends,
  enrollmentByStatus,
  enrollmentByGradeLevel,
  recentEnrollments,
  stats,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Registrar Dashboard</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <TimeRangeSelector defaultValue="6" />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="All time enrollment"
        />
        <StatCard
          title="Enrollments This Month"
          value={stats.enrollmentsThisMonth}
          subtitle="Current month"
        />
        <StatCard
          title="Pending Enrollments"
          value={stats.pendingEnrollments}
          subtitle="Awaiting approval"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EnrollmentBarChart data={enrollmentTrends} />
        <EnrollmentPieChart data={enrollmentByStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <GradeBarChart data={enrollmentByGradeLevel} />
      </div>

      <RecentEnrollmentsTable data={recentEnrollments} />
    </div>
  );
}
