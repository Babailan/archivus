import { notFound } from "next/navigation";
import { getEnrollmentById } from "../../action";
import { PaymentForm } from "./payment-form";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const enrollmentId = parseInt(id);

  if (isNaN(enrollmentId)) {
    notFound();
  }

  const enrollment = await getEnrollmentById(enrollmentId);

  if (!enrollment) {
    notFound();
  }

  return (
    <div className="px-10 py-2 mb-10">
      <h1 className="text-2xl font-bold mb-6">
        Payment - {enrollment.student.last_name},{" "}
        {enrollment.student.first_name}
      </h1>
      <PaymentForm enrollment={enrollment} />
    </div>
  );
}
