"use client";

import { Suspense } from "react";
import { StatCard } from "./stat-card";
import { TimeRangeSelector } from "./time-range-selector";
import { PaymentTrendChart } from "./charts/payment-trend-chart";
import { RecentPaymentsTable } from "./tables/recent-payments-table";
import type {
  RevenueTrend,
  RecentPayment,
} from "@/services/dashboard.service";

type Props = {
  paymentTrends: RevenueTrend[];
  recentPayments: RecentPayment[];
  stats: {
    todayCollections: number;
    totalRevenue: number;
    totalPayments: number;
  };
};

export function CashierDashboard({
  paymentTrends,
  recentPayments,
  stats,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Cashier Dashboard</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <TimeRangeSelector defaultValue="6" />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Today's Collections"
          value={`₱${stats.todayCollections.toLocaleString()}`}
          subtitle="Collections today"
        />
        <StatCard
          title="Total Revenue"
          value={`₱${stats.totalRevenue.toLocaleString()}`}
          subtitle="All time collections"
        />
        <StatCard
          title="Total Payments"
          value={stats.totalPayments}
          subtitle="Number of transactions"
        />
      </div>

      <PaymentTrendChart data={paymentTrends} />

      <RecentPaymentsTable data={recentPayments} />
    </div>
  );
}