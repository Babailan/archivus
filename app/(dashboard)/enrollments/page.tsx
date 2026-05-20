import { Metadata } from "next";
import { Suspense } from "react";
import { getEnrollments } from "./action";
import { EnrollmentsListForm } from "./enrollments-list-form";
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

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Enrollments",
};

export default async function EnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const { status, q, page } = await searchParams;
  const pageNum = page ? parseInt(page) : 1;
  const enrollmentsPromise = getEnrollments(status, q, pageNum);

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
            <BreadcrumbPage>Enrollments</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-bold mb-6">Enrollments</h1>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <EnrollmentsListForm
          enrollmentsPromise={enrollmentsPromise}
          statusFilter={status}
        />
      </Suspense>
    </div>
  );
}
