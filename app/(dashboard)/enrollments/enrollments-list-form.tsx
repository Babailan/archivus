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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { declineEnrollmentAction, approveEnrollmentAction } from "./action";
import {
  PaymentStatus,
  EnrollmentItem,
  SearchEnrollmentResult,
} from "@/services/enrollment.service";
import { toast } from "sonner";
import { Ellipsis, Check, X, Eye } from "lucide-react";
import { use } from "react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

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
  const { executeAsync: declineAsync, isExecuting: isDeclining } = useAction(
    declineEnrollmentAction,
  );
  const { executeAsync: approveAsync, isExecuting: isApproving } = useAction(
    approveEnrollmentAction,
  );

  const handleStatusChange = (value: string | null) => {
    if (value && value !== "all") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("status", value);
      router.push(`/enrollments?${params.toString()}`);
    } else {
      router.push("/enrollments");
    }
  };

  const handleDecline = async (id: number) => {
    const formData = new FormData();
    formData.append("id", id.toString());
    const { data } = await declineAsync(formData);
    if (data?.success) {
      toast.success("Enrollment declined");
    } else {
      toast.error("Failed to decline enrollment");
    }
  };

  const handleApprove = async (id: number) => {
    const formData = new FormData();
    formData.append("id", id.toString());
    const { data } = await approveAsync(formData);
    if (data?.success) {
      toast.success("Enrollment approved");
    } else {
      toast.error("Failed to approve enrollment");
    }
  };

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    declined: "Declined",
    dropped: "Dropped",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    approved: "bg-blue-500",
    declined: "bg-gray-500",
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
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "declined", label: "Declined" },
    { value: "dropped", label: "Dropped" },
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
        <Input placeholder="Search students..." className="max-w-sm" />
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow>
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
                    {enrollment.status == "pending" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon-sm">
                              <Ellipsis />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <Dialog>
                              <DialogTrigger
                                render={
                                  <Button
                                    variant={"secondary"}
                                    className={"w-full"}
                                  >
                                    <Check className="mr-2" />
                                    Approve
                                  </Button>
                                }
                              />
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Approve Enrollment</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to approve this
                                    enrollment? The student can proceed to
                                    payment.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose
                                    render={
                                      <Button variant="outline">Cancel</Button>
                                    }
                                  />
                                  <DialogClose
                                    render={
                                      <Button
                                        variant="default"
                                        onClick={() =>
                                          handleApprove(enrollment.id)
                                        }
                                        disabled={isApproving}
                                      >
                                        Approve
                                      </Button>
                                    }
                                  />
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <Dialog>
                              <DialogTrigger
                                render={
                                  <Button
                                    className={"w-full"}
                                    variant={"destructive"}
                                  >
                                    <X className="mr-2" />
                                    Decline
                                  </Button>
                                }
                              />
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Decline Enrollment</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to decline this
                                    enrollment? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose
                                    render={
                                      <Button variant="outline">Cancel</Button>
                                    }
                                  />
                                  <DialogClose
                                    render={
                                      <Button
                                        variant="destructive"
                                        onClick={() =>
                                          handleDecline(enrollment.id)
                                        }
                                        disabled={isDeclining}
                                      >
                                        Decline
                                      </Button>
                                    }
                                  />
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
