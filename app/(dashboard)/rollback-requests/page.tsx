import { Metadata } from "next";
import { Suspense } from "react";
import { getRollbackRequestsAction } from "./action";
import { RollbackRequestsList } from "./rollback-requests-list";
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
  title: "Rollback Requests",
};

export default async function RollbackRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>;
}) {
  const { status, page, q } = await searchParams;
  const pageNum = page ? parseInt(page) : 1;
  const requestsPromise = getRollbackRequestsAction(status, pageNum, q);

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
            <BreadcrumbPage>Rollback Requests</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-bold mb-6">Rollback Requests</h1>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <RollbackRequestsList requestsPromise={requestsPromise} />
      </Suspense>
    </div>
  );
}
