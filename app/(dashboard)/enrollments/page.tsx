import { Suspense } from "react";
import { getEnrollments } from "./action";
import { EnrollmentsListForm } from "./enrollments-list-form";
import { Skeleton } from "@/components/ui/skeleton";
import { queryFirst } from "@/lib/helper";
export const dynamic = "force-dynamic";
export default async function EnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const { status, q, page } = await searchParams;
  const pageNum = page ? parseInt(page) : 1;
  const enrollmentsPromise = getEnrollments(status, q, pageNum);

  return (
    <div className="px-10 py-2 mb-10">
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
