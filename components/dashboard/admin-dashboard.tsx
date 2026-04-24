"use client";

import { Suspense } from "react";
import Link from "next/link";
import { StatCard } from "./stat-card";
import { TimeRangeSelector } from "./time-range-selector";
import { RevenueBarChart } from "./charts/revenue-bar-chart";
import { RecentRollbacksTable } from "./tables/recent-rollbacks-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  RevenueTrend,
  RecentRollback,
} from "@/services/dashboard.service";

type Props = {
  revenueTrends: RevenueTrend[];
  recentRollbacks: RecentRollback[];
  pendingRollbackCount: number;
  stats: {
    totalStudents: number;
    totalRevenue: number;
    activeUsers: number;
  };
};

export function AdminDashboard({
  revenueTrends,
  recentRollbacks,
  pendingRollbackCount,
  stats,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Administrator Dashboard</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <TimeRangeSelector defaultValue="6" />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="All time enrollment"
        />
        <StatCard
          title="Total Revenue"
          value={`₱${stats.totalRevenue.toLocaleString()}`}
          subtitle="All time collections"
        />
        <Link href="/rollback-requests">
          <div className="relative">
            <StatCard
              title="Pending Rollback Requests"
              value={pendingRollbackCount}
              subtitle="Click to review"
              className={cn(
                "cursor-pointer hover:shadow-md transition-shadow",
                pendingRollbackCount > 0 && "border-yellow-500 border-2"
              )}
            />
            {pendingRollbackCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-yellow-500">
                {pendingRollbackCount}
              </Badge>
            )}
          </div>
        </Link>
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          subtitle="System users"
        />
      </div>

      <RevenueBarChart data={revenueTrends} />

      <RecentRollbacksTable data={recentRollbacks} />
    </div>
  );
}