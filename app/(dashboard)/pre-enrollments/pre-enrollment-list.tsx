"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAction } from "next-safe-action/hooks";
import { approvePreEnrollmentAction, declinePreEnrollmentAction } from "./action";
import { toast } from "sonner";
import { Ellipsis, Check, X, PencilLine } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { format } from "date-fns";
import { PreEnrollment } from "@/app/generated/prisma";

export function PreEnrollmentList({
  dataPromise,
}: {
  dataPromise: Promise<any>;
}) {
  const { preEnrollments, total, page, pageSize } = use(dataPromise);
  const totalPages = Math.ceil(total / pageSize);
  const router = useRouter();

  const { executeAsync: approveAsync } = useAction(approvePreEnrollmentAction);
  const { executeAsync: declineAsync } = useAction(declinePreEnrollmentAction);

  const handleAccept = async (id: number) => {
    const formData = new FormData();
    formData.append("id", id.toString());
    const { data } = await approveAsync(formData);
    if (data?.success) {
      toast.success("Application approved! Student ID assigned.");
    } else {
      toast.error("Failed to approve application");
    }
  };

  const handleDeny = async (id: number) => {
    const formData = new FormData();
    formData.append("id", id.toString());
    const { data } = await declineAsync(formData);
    if (data?.success) {
      toast.success("Application declined");
    } else {
      toast.error("Failed to decline application");
    }
  };

  return (
    <div className="space-y-4">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Reference Code</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Grade Level</TableHead>
            <TableHead>School Year</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {preEnrollments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-muted-foreground"
              >
                No pending applications found
              </TableCell>
            </TableRow>
          ) : (
            preEnrollments.map((item: PreEnrollment) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.reference_code}
                </TableCell>
                <TableCell>
                  {item.last_name}, {item.first_name} {item.middle_name}
                </TableCell>
                <TableCell className="capitalize">{item.grade_level}</TableCell>
                <TableCell>{item.school_year}</TableCell>
                <TableCell>{format(new Date(item.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button size="sm" variant="ghost">
                          <Ellipsis className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/pre-enrollments/${item.id}`)}
                      >
                        <PencilLine className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAccept(item.id)}
                        className="text-green-600"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Accept
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeny(item.id)}
                        className="text-red-600"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Deny
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
