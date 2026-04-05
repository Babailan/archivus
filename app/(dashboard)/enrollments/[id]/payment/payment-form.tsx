"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { recordPaymentAction } from "../../action";
import { toast } from "sonner";
import { CircleDollarSign, Calculator } from "lucide-react";
import { EnrollmentWithDetails } from "@/services/enrollment.service";

interface PaymentFormProps {
  enrollment: EnrollmentWithDetails;
}

export function PaymentForm({ enrollment }: PaymentFormProps) {
  if (!enrollment) {
    return <div>Enrollment not found</div>;
  }

  const { executeAsync, isExecuting } = useAction(recordPaymentAction);
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const totalTuition = enrollment.total_tuition_snapshot;
  const totalPaid = enrollment.payments.reduce(
    (sum, p) => sum + p.amount_paid,
    0,
  );
  const remainingBalance = totalTuition - totalPaid;
  const minPartialPayment = totalTuition * 0.2;

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

  const handlePay = async () => {
    if (!amount || !paymentMethod) {
      toast.error("Please fill in all fields");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Invalid amount");
      return;
    }

    const receiptNo = `RCP-${Date.now()}`;
    const formData = new FormData();
    formData.append("enrollment_id", enrollment.id.toString());
    formData.append("amount_paid", amountNum.toString());
    formData.append("payment_method", paymentMethod);
    formData.append("receipt_no", receiptNo);

    const { data } = await executeAsync(formData);
    if (data?.success) {
      toast.success(
        data.isFullyPaid
          ? "Payment recorded. Enrollment is fully paid!"
          : "Partial payment recorded!",
      );
    } else {
      toast.error("Failed to record payment");
    }
  };

  const setFullPayment = () => {
    setAmount(remainingBalance.toString());
  };

  const setMinPartial = () => {
    setAmount(minPartialPayment.toString());
  };

  return (
    <div className="px-10 py-2 mb-10 max-w-2xl">
      <FieldSet>
        <FieldLegend variant="legend" className="flex gap-2 items-center">
          <CircleDollarSign />
          Payment
        </FieldLegend>

        <div className="bg-muted p-4 rounded-lg mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Tuition:</span>
            <span className="font-medium">
              ₱{totalTuition.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Paid:</span>
            <span className="font-medium">₱{totalPaid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-muted-foreground">Remaining Balance:</span>
            <span className="font-medium">
              ₱{remainingBalance.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Min Partial (20%):</span>
            <span>₱{minPartialPayment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-muted-foreground">Payment Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs text-white ${paymentStatusColors[enrollment.paymentStatus]}`}
            >
              {paymentStatusLabels[enrollment.paymentStatus]}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={setFullPayment}>
            Set Full Payment
          </Button>
          <Button variant="outline" onClick={setMinPartial}>
            Min Partial (20%)
          </Button>
        </div>

        <FieldGroup className="mt-4">
          <Field>
            <FieldLabel>Amount</FieldLabel>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <FieldError />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Payment Method</FieldLabel>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v || "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="GCash">GCash</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
              </SelectContent>
            </Select>
            <FieldError />
          </Field>
        </FieldGroup>

        <Button className="mt-4" onClick={handlePay} disabled={isExecuting}>
          <Calculator className="w-4 h-4 mr-2" />
          {isExecuting ? "Processing..." : "Record Payment"}
        </Button>
      </FieldSet>
    </div>
  );
}
