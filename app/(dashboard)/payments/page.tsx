import { Suspense } from "react";
import { getPayments } from "./action";
import { PaymentsList } from "./payments-list";
import { Skeleton } from "@/components/ui/skeleton";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const paymentsPromise = getPayments(q);

  return (
    <div className="px-10 py-2 mb-10">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <PaymentsList paymentsPromise={paymentsPromise} />
      </Suspense>
    </div>
  );
}
