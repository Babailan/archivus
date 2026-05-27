"use client";

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
  SearchEnrollmentResult,
} from "@/services/enrollment.service";
import { Eye } from "lucide-react";
import { use, useState, useEffect, useRef } from "react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useDebounce } from "use-debounce";

interface EnrollmentsListFormProps {
  enrollmentsPromise: Promise<SearchEnrollmentResult>;
  statusFilter?: string;
}

export function EnrollmentsListForm({
  enrollmentsPromise,
  statusFilter,
}: EnrollmentsListFormProps) {
  const { enrollments, total, page, pageSize } = use(enrollmentsPromise);
  const totalPages = Math.ceil(total / pageSize);
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatSchoolYear = (schoolYear: string) => {
    return schoolYear;
  };


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
    router.push(`/enrollments?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, router]); // purposely omitting searchParams to avoid infinite loops if it changes externally

  const handleStatusChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    params.delete("page");
    router.push(`/enrollments?${params.toString()}`);
  };

  const statusLabels: Record<string, string> = {
    cancelled: "Cancelled",
    approved: "Approved",
    dropped: "Dropped",
  };

  const statusColors: Record<string, string> = {
    cancelled: "bg-gray-500",
    approved: "bg-blue-500",
    dropped: "bg-red-500",
  };

  const paymentStatusLabels: Record<string, string> = {
    unpaid: "Unpaid",
    partial: "Partial",
    fully_paid: "Fully Paid",
  };

  const paymentStatusColors: Record<string, string> = {
    unpaid: "bg-red-500",
    partial: "bg-yellow-500",
    fully_paid: "bg-green-500",
  };

  const statusFilters = [
    { value: "all", label: "All" },
    { value: "approved", label: "Approved" },
    { value: "dropped", label: "Dropped" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={
                statusFilter === filter.value ||
                (statusFilter == undefined && filter.value == "all")
                  ? "default"
                  : "outline"
              }
              onClick={() => handleStatusChange(filter.value!)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <Input
          placeholder="Search name, reference, email..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Ref</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Grade Level</TableHead>
            <TableHead>School Year</TableHead>
            <TableHead>Total Tuition</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-muted-foreground"
              >
                No enrollments found
              </TableCell>
            </TableRow>
          ) : (
            enrollments.map((enrollment) => (
              <TableRow key={enrollment.id}>
                <TableCell>{enrollment.reference_code}</TableCell>
                <TableCell>
                  {enrollment.student.last_name},{" "}
                  {enrollment.student.first_name}{" "}
                  {enrollment.student.middle_name}
                </TableCell>
                <TableCell>{enrollment.curriculum.grade_level}</TableCell>
                <TableCell>
                  {formatSchoolYear(enrollment.school_year)}
                </TableCell>
                <TableCell>
                  ₱{enrollment.total_tuition_snapshot.toLocaleString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs text-white ${statusColors[enrollment.status]}`}
                  >
                    {statusLabels[enrollment.status]}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs text-white ${paymentStatusColors[enrollment.paymentStatus]}`}
                  >
                    {paymentStatusLabels[enrollment.paymentStatus]}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        router.push(`/enrollments/${enrollment.id}/student`)
                      }
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <DataTablePagination page={page} totalPages={totalPages} />
    </div>
  );
}
