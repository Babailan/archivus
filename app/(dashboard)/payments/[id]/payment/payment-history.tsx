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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Printer } from "lucide-react";

interface PaymentHistoryProps {
  payments: PaymentHistoryItem[];
  studentName: string;
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

export function PaymentHistory({ payments, studentName }: PaymentHistoryProps) {
  const [rollbackDialogOpen, setRollbackDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(
    null,
  );
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentHistoryItem | null>(null);
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

  const handlePrintReceipt = (payment: PaymentHistoryItem) => {
    setSelectedPayment(payment);
    setPrintDialogOpen(true);
  };

  const handlePrint = () => {
    window.print();
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
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePrintReceipt(payment)}
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
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
                          onClick={() =>
                            handleCancel(payment.rollbackRequestId!)
                          }
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
                    </div>
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

      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Official Receipt</DialogTitle>
            <DialogDescription>
              Review and print the receipt below.
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div id="receipt-content" className="space-y-4 py-2">
              <div className="text-center border-b pb-3">
                <h3 className="font-bold text-lg">School Management System</h3>
                <p className="text-sm text-muted-foreground">
                  Official Receipt
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receipt No:</span>
                  <span className="font-medium">
                    {selectedPayment.receipt_no}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {selectedPayment.payment_date.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student:</span>
                  <span className="font-medium">{studentName}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-bold text-lg">
                    ₱{selectedPayment.amount_paid.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrintDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
