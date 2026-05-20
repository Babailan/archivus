import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchStudentVerificationById,
  approveStudentVerificationAction,
  declineStudentVerificationAction,
} from "../action";
import { PreEnrollmentEditForm } from "./pre-edit-form";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const idNum = parseInt(id);
  if (isNaN(idNum)) return { title: "View New Student" };

  try {
    const preEnrollment = await fetchStudentVerificationById(idNum);
    return {
      title: `View New Student: ${preEnrollment.first_name} ${preEnrollment.last_name}`,
    };
  } catch {
    return { title: "View New-Student" };
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
    preEnrollment = await fetchStudentVerificationById(idNum);
  } catch {
    notFound();
  }

  if (preEnrollment.status !== "pending") {
    notFound();
  }

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
            <BreadcrumbLink render={<Link href="/student-verification" />}>
              Student Verification
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>View</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-bold mb-6">View New Student</h1>
      <PreEnrollmentEditForm
        preEnrollment={preEnrollment}
        approveAction={approveStudentVerificationAction}
        declineAction={declineStudentVerificationAction}
      />
    </div>
  );
}
