import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPreEnrollmentById, approvePreEnrollmentAction, declinePreEnrollmentAction } from "../action";
import { PreEnrollmentEditForm } from "./pre-edit-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idNum = parseInt(id);
  if (isNaN(idNum)) return { title: "View Pre-Enrollment" };

  try {
    const preEnrollment = await fetchPreEnrollmentById(idNum);
    return {
      title: `View Pre-Enrollment: ${preEnrollment.first_name} ${preEnrollment.last_name}`,
    };
  } catch {
    return { title: "View Pre-Enrollment" };
  }
}

export default async function PreEnrollmentViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idNum = parseInt(id);

  if (isNaN(idNum)) {
    notFound();
  }

  let preEnrollment;
  try {
    preEnrollment = await fetchPreEnrollmentById(idNum);
  } catch {
    notFound();
  }

  if (preEnrollment.status !== "pending") {
    notFound();
  }

  return (
    <div className="px-10 py-2 mb-10">
      <h1 className="text-2xl font-bold mb-6">View Pre-Enrollment</h1>
      <PreEnrollmentEditForm
        preEnrollment={preEnrollment}
        approveAction={approvePreEnrollmentAction}
        declineAction={declinePreEnrollmentAction}
      />
    </div>
  );
}