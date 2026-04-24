import { Suspense } from "react";
import { getRollbackRequestsAction } from "./action";
import { RollbackRequestsList } from "./rollback-requests-list";
import { Skeleton } from "@/components/ui/skeleton";

export default async function RollbackRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page } = await searchParams;
  const pageNum = page ? parseInt(page) : 1;
  const requestsPromise = getRollbackRequestsAction(status, pageNum);

  return (
    <div className="px-10 py-2 mb-10">
      <h1 className="text-2xl font-bold mb-6">Rollback Requests</h1>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <RollbackRequestsList requestsPromise={requestsPromise} />
      </Suspense>
    </div>
  );
}
