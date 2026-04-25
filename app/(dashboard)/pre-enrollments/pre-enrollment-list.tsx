"use client";

import { use } from "react";
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
import { approvePreEnrollmentAction, declinePreEnrollmentAction } from "./action";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { format } from "date-fns";

export function PreEnrollmentList({
  dataPromise,
  statusFilter,
}: {
  dataPromise: Promise<any>;
  statusFilter: string;
}) {
  const { preEnrollments, total, page, pageSize } = use(dataPromise);
  const totalPages = Math.ceil(total / pageSize);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { executeAsync: approveAsync, isExecuting: isApproving } = useAction(
    approvePreEnrollmentAction,
  );
  const { executeAsync: declineAsync, isExecuting: isDeclining } = useAction(
    declinePreEnrollmentAction,
  );

  const handleApprove = async (id: number) => {
    const formData = new FormData();
    formData.append("id", id.toString());
    const { data } = await approveAsync(formData);
    if (data?.success) {
      toast.success("Application approved! Student ID assigned.");
    } else {
      toast.error("Failed to approve application");
    }
  };

  const handleDecline = async (id: number) => {
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
            preEnrollments.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.last_name}, {item.first_name} {item.middle_name}
                </TableCell>
                <TableCell className="capitalize">{item.grade_level}</TableCell>
                <TableCell>{item.school_year}</TableCell>
                <TableCell>{format(new Date(item.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Dialog>
                      <DialogTrigger render={
                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" />
                      }>
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Approve Application</DialogTitle>
                          <DialogDescription>
                            Confirming this will create an official Student record and assign a permanent ID.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose render={<Button variant="outline" />}>
                            Cancel
                          </DialogClose>
                          <Button 
                            disabled={isApproving} 
                            onClick={() => handleApprove(item.id)}
                          >
                            Approve
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger render={
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" />
                      }>
                        <X className="h-4 w-4 mr-1" /> Decline
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Decline Application</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to decline this application?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose render={<Button variant="outline" />}>
                            Cancel
                          </DialogClose>
                          <Button 
                            variant="destructive" 
                            disabled={isDeclining} 
                            onClick={() => handleDecline(item.id)}
                          >
                            Decline
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
