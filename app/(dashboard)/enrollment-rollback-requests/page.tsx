import { Metadata } from "next";
import { Suspense } from "react";
import { getEnrollmentRollbackRequestsAction } from "../enrollments/rollback-action";
import { EnrollmentRollbackRequestsList } from "./enrollment-rollback-requests-list";
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
  title: "Enrollment Rollback Requests",
};

export default async function EnrollmentRollbackRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q, status, page } = await searchParams;
  const pageNum = page ? parseInt(page) : 1;
  const requestsPromise = getEnrollmentRollbackRequestsAction(
    status,
    pageNum,
    q,
  );

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
            <BreadcrumbPage>Enrollment Rollback Requests</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-bold mb-6">Enrollment Rollback Requests</h1>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <EnrollmentRollbackRequestsList requestsPromise={requestsPromise} />
      </Suspense>
    </div>
  );
}
