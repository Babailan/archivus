import { getStudentByEnrollment } from "../../action";
import { StudentForm } from "./student-form";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getStudentByEnrollment(Number(id));

  if (!data) {
    return (
      <div className="container mx-auto py-8">
        <p>Enrollment not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Student Information</h1>
        <p className="text-muted-foreground">View and edit student details</p>
      </div>

      <StudentForm student={data.student} enrollment={data.enrollment} />
    </div>
  );
}
