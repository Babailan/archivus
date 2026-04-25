import { Metadata } from "next";
import { Suspense } from "react";
import { fetchPreEnrollments } from "./action";
import { PreEnrollmentList } from "./pre-enrollment-list";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Pre-Enrollments",
};

export default async function PreEnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page } = await searchParams;
  const pageNum = page ? parseInt(page) : 1;
  const dataPromise = fetchPreEnrollments(status || "pending", pageNum);

  return (
    <div className="px-10 py-2 mb-10">
      <h1 className="text-2xl font-bold mb-6">Pre-Enrollments (Pending)</h1>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <PreEnrollmentList
          dataPromise={dataPromise}
          statusFilter={status || "pending"}
        />
      </Suspense>
    </div>
  );
}
