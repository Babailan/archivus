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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useAction } from "next-safe-action/hooks";
import { dropEnrollmentAction } from "./action";
import { toast } from "sonner";
import { UserMinus, Eye } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useDebounce } from "use-debounce";

export function StudentList({ dataPromise }: { dataPromise: Promise<any> }) {
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
  }, [debouncedSearch, router]); // purposely omitting searchParams to avoid infinite loops if it changes externally

  const { executeAsync: dropAsync, isExecuting: isDropping } =
    useAction(dropEnrollmentAction);

  const handleDrop = async (enrollmentId: number) => {
    const formData = new FormData();
    formData.append("id", enrollmentId.toString());
    const { data } = await dropAsync(formData);
    if (data?.success) {
      toast.success("Student dropped from enrollment");
    } else {
      toast.error("Failed to drop student");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search students..."
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
            students.map((student: any) => {
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
                        onClick={() =>
                          router.push(
                            `/students/${student.id}`,
                          )
                        }
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
