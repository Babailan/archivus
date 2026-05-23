import { getStudentWithDocuments } from "@/services/student.service";
import { StudentEditForm } from "./student-edit-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getStudentWithDocuments(Number(id));

  if (!data) {
    return (
      <div className="container mx-auto p-10">
        <p className="text-muted-foreground text-center py-10 border rounded-lg bg-card">
          Student not found.
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
            <BreadcrumbLink render={<Link href="/students" />}>
              Official Students
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Student Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <h1 className="text-2xl font-bold">Student Profile</h1>
        <p className="text-muted-foreground">View and edit student credentials and checklist</p>
      </div>

      <StudentEditForm
        student={data.student}
        activeDocuments={data.activeDocuments}
        checkedDocumentIds={data.checkedDocumentIds}
      />
    </div>
  );
}
