import { Metadata } from "next";
import { Suspense } from "react";
import { fetchStudentVerifications } from "./action";
import { StudentVerificationList } from "./student-verification-list";
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
  title: "Student Verification",
};

export default async function PreEnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>;
}) {
  const { status, page, q } = await searchParams;
  const pageNum = page ? parseInt(page) : 1;
  const dataPromise = fetchStudentVerifications(
    status || "pending",
    pageNum,
    undefined,
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
            <BreadcrumbPage>Student Verification</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-bold mb-6">Student Verification (New Students)</h1>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <StudentVerificationList dataPromise={dataPromise} />
      </Suspense>
    </div>
  );
}
