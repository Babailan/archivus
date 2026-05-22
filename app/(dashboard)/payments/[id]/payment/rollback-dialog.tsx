"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { requestRollbackAction } from "./action";

interface RollbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: number;
  onSuccess: () => void;
}

export function RollbackDialog({
  open,
  onOpenChange,
  paymentId,
  onSuccess,
}: RollbackDialogProps) {
  const [reason, setReason] = useState("");
  const { executeAsync, isExecuting } = useAction(requestRollbackAction);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    const formData = new FormData();
    formData.append("payment_id", paymentId.toString());
    formData.append("reason", reason);

    const { data } = await executeAsync(formData);
    if (data?.success) {
      toast.success("Rollback request submitted");
      setReason("");
      onOpenChange(false);
      onSuccess();
    } else {
      toast.error(data?.error ?? "Failed to submit rollback request");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isExecuting) {
      setReason("");
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Rollback</DialogTitle>
          <DialogDescription>
            Provide a reason for this rollback request. An admin must approve it
            before the payment is removed.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Enter reason for rollback..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExecuting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isExecuting}>
            {isExecuting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
