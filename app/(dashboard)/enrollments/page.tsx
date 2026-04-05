import { Suspense } from "react";
import { getEnrollments } from "./action";
import { EnrollmentsListForm } from "./enrollments-list-form";
import { Skeleton } from "@/components/ui/skeleton";

export default async function EnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const enrollmentsPromise = getEnrollments(status);

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
