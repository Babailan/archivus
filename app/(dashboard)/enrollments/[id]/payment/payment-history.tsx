"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RollbackDialog } from "./rollback-dialog";
import { cancelRollbackAction } from "./action";
import { PaymentHistoryItem } from "@/services/rollback.service";

interface PaymentHistoryProps {
  payments: PaymentHistoryItem[];
}

const statusLabels: Record<string, string> = {
  active: "Active",
  pending: "Request Pending",
  approved: "Rolled Back",
  denied: "Denied",
  cancelled: "Cancelled",
};

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  pending: "bg-yellow-500",
  approved: "bg-red-500",
  denied: "bg-orange-500",
  cancelled: "bg-gray-500",
};

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const [rollbackDialogOpen, setRollbackDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const { executeAsync, isExecuting } = useAction(cancelRollbackAction);

  const handleRequestRollback = (paymentId: number) => {
    setSelectedPaymentId(paymentId);
    setRollbackDialogOpen(true);
  };

  const handleCancel = async (requestId: number) => {
    const formData = new FormData();
    formData.append("id", requestId.toString());

    const { data } = await executeAsync(formData);
    if (data?.success) {
      toast.success("Rollback request cancelled");
      setRefreshKey((k) => k + 1);
    } else {
      toast.error(data?.error ?? "Failed to cancel request");
    }
  };

  const handleRollbackSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  const key = `${refreshKey}-${payments.length}`;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Payment History</h2>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Receipt No</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody key={key}>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No payments recorded yet
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {payment.payment_date.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{payment.receipt_no}</TableCell>
                  <TableCell>₱{payment.amount_paid.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusColors[payment.rollbackStatus]}`}
                    >
                      {statusLabels[payment.rollbackStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.rollbackStatus === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRequestRollback(payment.id)}
                      >
                        Request Rollback
                      </Button>
                    )}
                    {payment.rollbackStatus === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(payment.rollbackRequestId!)}
                        disabled={isExecuting}
                      >
                        Cancel Request
                      </Button>
                    )}
                    {(payment.rollbackStatus === "denied" ||
                      payment.rollbackStatus === "cancelled") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRequestRollback(payment.id)}
                      >
                        Request Rollback
                      </Button>
                    )}
                    {payment.rollbackStatus === "approved" && (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedPaymentId !== null && (
        <RollbackDialog
          open={rollbackDialogOpen}
          onOpenChange={setRollbackDialogOpen}
          paymentId={selectedPaymentId}
          onSuccess={handleRollbackSuccess}
        />
      )}
    </div>
  );
}
