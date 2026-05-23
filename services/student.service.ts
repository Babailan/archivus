import prisma from "@/lib/prisma";

export async function getStudentWithDocuments(id: number) {
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      documents: true,
    },
  });

  if (!student) return null;

  // Get all active documents
  const activeDocuments = await prisma.document.findMany({
    where: { inactive: false },
    orderBy: { name: "asc" },
  });

  // Extract checked document IDs
  const checkedDocumentIds = student.documents.map((d) => d.document_id);

  return {
    student: {
      ...student,
      date_of_birth: student.date_of_birth.toISOString().split("T")[0],
    },
    activeDocuments,
    checkedDocumentIds,
  };
}

export async function updateStudentWithDocuments(data: {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: string;
  address: string;
  gender: "male" | "female";
  email: string;
  document_ids: number[];
}) {
  return await prisma.$transaction(async (tx) => {
    // Update student personal information
    const student = await tx.student.update({
      where: { id: data.id },
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        date_of_birth: new Date(data.date_of_birth),
        address: data.address,
        gender: data.gender,
        email: data.email,
      },
    });

    // Delete existing student documents mapping
    await tx.studentDocument.deleteMany({
      where: {
        student_id: data.id,
      },
    });

    // Bulk insert selected documents
    if (data.document_ids.length > 0) {
      await tx.studentDocument.createMany({
        data: data.document_ids.map((docId) => ({
          student_id: data.id,
          document_id: docId,
        })),
      });
    }

    return student;
  });
}
