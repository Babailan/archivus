import { Metadata } from "next";
import { Suspense } from "react";
import { getPayments } from "./action";
import { RecentPaymentsList } from "./recent-payments-list";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recent Payments",
};

export default async function RecentPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const pageNum = page ? parseInt(page) : 1;
  const paymentsPromise = getPayments(q, pageNum);

  return (
    <div className="p-10 mb-10">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Recent Payments</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-bold mb-6">Recent Payments</h1>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <RecentPaymentsList paymentsPromise={paymentsPromise} />
      </Suspense>
    </div>
  );
}
