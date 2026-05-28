"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import { Eye } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useDebounce } from "use-debounce";

type StudentData = {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  enrollments?: Array<{
    status: string;
    curriculum?: {
      grade_level: string;
    };
  }>;
};

export function StudentList({
  dataPromise,
}: {
  dataPromise: Promise<{
    students: StudentData[];
    total: number;
    page: number;
    pageSize: number;
  }>;
}) {
  const { students, total, page, pageSize } = use(dataPromise);
  const totalPages = Math.ceil(total / pageSize);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("q", debouncedSearch);
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/students?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, router]); // purposely omitting searchParams to avoid infinite loops if it changes externally

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search students by name or ID..."
        className="max-w-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Latest Grade Level</TableHead>
            <TableHead>Enrollment Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-muted-foreground"
              >
                No official students found
              </TableCell>
            </TableRow>
          ) : (
            students.map((student: StudentData) => {
              const latestEnrollment = student.enrollments?.[0];
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-mono font-medium">
                    {student.id}
                  </TableCell>
                  <TableCell>
                    {student.last_name}, {student.first_name}{" "}
                    {student.middle_name}
                  </TableCell>
                  <TableCell className="capitalize">
                    {latestEnrollment?.curriculum?.grade_level || "N/A"}
                  </TableCell>
                  <TableCell>
                    {latestEnrollment ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs text-white ${
                          latestEnrollment.status === "approved"
                            ? "bg-green-500"
                            : latestEnrollment.status === "dropped"
                              ? "bg-red-500"
                              : "bg-gray-500"
                        }`}
                      >
                        {latestEnrollment.status}
                      </span>
                    ) : (
                      "No Enrollment"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/students/${student.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <DataTablePagination page={page} totalPages={totalPages} />
    </div>
  );
}
