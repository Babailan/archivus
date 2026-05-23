import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchStudentVerificationById,
  approveStudentVerificationAction,
  declineStudentVerificationAction,
} from "../action";
import { StudentVerificationEditForm } from "./student-verification-edit-form";
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
    const studentVerification = await fetchStudentVerificationById(idNum);
    return {
      title: `View New Student: ${studentVerification.first_name} ${studentVerification.last_name}`,
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

  let studentVerification;
  try {
    studentVerification = await fetchStudentVerificationById(idNum);
  } catch {
    notFound();
  }

  if (studentVerification.status !== "pending") {
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
      <StudentVerificationEditForm
        studentVerification={studentVerification}
        approveAction={approveStudentVerificationAction}
        declineAction={declineStudentVerificationAction}
      />
    </div>
  );
}
