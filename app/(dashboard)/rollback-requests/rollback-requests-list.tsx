"use client";

import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { approveRollbackAction, denyRollbackAction } from "./action";
import { getRollbackRequests } from "@/services/rollback.service";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface RollbackRequestsListProps {
  requestsPromise: Promise<{
    requests: Awaited<ReturnType<typeof getRollbackRequests>>["requests"];
    total: number;
    page: number;
    pageSize: number;
  }>;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  denied: "Denied",
  cancelled: "Cancelled",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  denied: "bg-red-500",
  cancelled: "bg-gray-500",
};

const statusFilterTabs = ["all", "pending", "approved", "denied", "cancelled"];

export function RollbackRequestsList({
  requestsPromise,
}: RollbackRequestsListProps) {
  const { requests, total, page, pageSize } = use(requestsPromise);
  const totalPages = Math.ceil(total / pageSize);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") ?? "all";

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "approve" | "deny";
    id: number | null;
  }>({ open: false, action: "approve", id: null });

  const { executeAsync: executeApprove, isExecuting: isApproving } = useAction(
    approveRollbackAction,
  );
  const { executeAsync: executeDeny, isExecuting: isDenying } =
    useAction(denyRollbackAction);

  const handleConfirm = async () => {
    if (!confirmDialog.id) return;

    const formData = new FormData();
    formData.append("id", confirmDialog.id.toString());

    let result;
    if (confirmDialog.action === "approve") {
      result = await executeApprove(formData);
    } else {
      result = await executeDeny(formData);
    }

    if (result?.data?.success) {
      toast.success(
        confirmDialog.action === "approve"
          ? "Rollback approved. Payment has been removed."
          : "Rollback request denied.",
      );
    } else {
      toast.error(
        result?.data?.error ?? `Failed to ${confirmDialog.action} request`,
      );
    }

    setConfirmDialog({ open: false, action: "approve", id: null });
  };

  const openConfirm = (id: number, action: "approve" | "deny") => {
    setConfirmDialog({ open: true, action, id });
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {statusFilterTabs.map((tab) => (
          <Button
            key={tab}
            variant={currentStatus === tab ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Cashier</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  No rollback requests found
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    {request.payment.enrollment.student.last_name},{" "}
                    {request.payment.enrollment.student.first_name}
                  </TableCell>
                  <TableCell>
                    ₱{request.payment.amount_paid.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {request.requested_by.last_name},{" "}
                    {request.requested_by.first_name}
                    {request.requested_by.middle_name
                      ? ` ${request.requested_by.middle_name}`
                      : ""}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {request.reason}
                  </TableCell>
                  <TableCell>
                    {request.created_at.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[request.status]}>
                      {statusLabels[request.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openConfirm(request.id, "approve")}
                          disabled={isApproving}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openConfirm(request.id, "deny")}
                          disabled={isDenying}
                        >
                          Deny
                        </Button>
                      </div>
                    )}
                    {request.status !== "pending" && (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination page={page} totalPages={totalPages} />

      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === "approve"
                ? "Approve Rollback"
                : "Deny Rollback"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === "approve"
                ? "This will remove the payment from the student's record. This action cannot be undone."
                : "This will deny the rollback request. The payment will remain in the record."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({ open: false, action: "approve", id: null })
              }
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmDialog.action === "approve" ? "default" : "destructive"
              }
              onClick={handleConfirm}
            >
              {confirmDialog.action === "approve" ? "Approve" : "Deny"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
