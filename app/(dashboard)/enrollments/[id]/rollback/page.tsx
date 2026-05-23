import { getStudentByEnrollment } from "../../action";
import { EnrollmentRollbackForm } from "./enrollment-rollback-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enrollment Rollback Request",
};

export default async function EnrollmentRollbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getStudentByEnrollment(Number(id));

  if (!data) return notFound();

  // Only approved or hasPendingRollbackRequest enrollments can visit this page
  if (data.enrollment.status === "dropped") {
    return (
      <div className="container mx-auto p-10">
        <p className="text-muted-foreground">
          Dropped enrollments cannot request a rollback.
        </p>
      </div>
    );
  }

  if (data.enrollment.status === "cancelled") {
    return (
      <div className="container mx-auto p-10">
        <p className="text-muted-foreground">
          This enrollment has already been cancelled.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-10 space-y-6">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/enrollments" />}>
              Enrollments
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href={`/enrollments/${id}/student`} />}
            >
              Student Details
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Rollback Request</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold">Enrollment Rollback Request</h1>
        <p className="text-muted-foreground">
          Request cancellation of this enrollment. Requires admin approval.
        </p>
      </div>

      <EnrollmentRollbackForm
        enrollment={data.enrollment}
        student={data.student}
      />
    </div>
  );
}
