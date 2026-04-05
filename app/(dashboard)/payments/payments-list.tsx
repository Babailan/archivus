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
import { ApprovedEnrollment } from "@/services/payment.service";
import { use } from "react";
import { Wallet } from "lucide-react";

interface PaymentsListProps {
  paymentsPromise: Promise<ApprovedEnrollment[]>;
}

export function PaymentsList({ paymentsPromise }: PaymentsListProps) {
  const payments = use(paymentsPromise);
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input placeholder="Search by student name..." className="max-w-sm" />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>School Year</TableHead>
              <TableHead>Total Tuition</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Min Partial</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-8 text-center text-muted-foreground"
                >
                  No approved enrollments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment: ApprovedEnrollment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {payment.student.last_name}, {payment.student.first_name}
                  </TableCell>
                  <TableCell>{payment.grade_level}</TableCell>
                  <TableCell>{payment.school_year}</TableCell>
                  <TableCell>
                    ₱{payment.total_tuition.toLocaleString()}
                  </TableCell>
                  <TableCell>₱{payment.total_paid.toLocaleString()}</TableCell>
                  <TableCell>₱{payment.balance.toLocaleString()}</TableCell>
                  <TableCell>
                    ₱{payment.min_partial_payment.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-white ${paymentStatusColors[payment.paymentStatus]}`}
                    >
                      {paymentStatusLabels[payment.paymentStatus]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(`/enrollments/${payment.id}/payment`)
                      }
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Pay
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
