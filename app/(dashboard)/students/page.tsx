import { Metadata } from "next";
import { Suspense } from "react";
import { fetchStudents } from "./action";
import { StudentList } from "./student-list";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Official Students",
};

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const pageNum = page ? parseInt(page) : 1;
  const dataPromise = fetchStudents(q, pageNum);

  return (
    <div className="px-10 py-2 mb-10">
      <h1 className="text-2xl font-bold mb-6">Official Students</h1>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <StudentList
          dataPromise={dataPromise}
        />
      </Suspense>
    </div>
  );
}
