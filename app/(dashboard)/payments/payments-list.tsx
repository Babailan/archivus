"use client";

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
import { Input } from "@/components/ui/input";
import { PaymentsResult } from "@/services/payment.service";
import { use } from "react";
import { Wallet } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface PaymentsListProps {
  paymentsPromise: Promise<PaymentsResult>;
}

export function PaymentsList({ paymentsPromise }: PaymentsListProps) {
  const { enrollments, total, page, pageSize } = use(paymentsPromise);
  const totalPages = Math.ceil(total / pageSize);
  const router = useRouter();

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
              <TableHead>ID</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>School Year</TableHead>
              <TableHead>Total Tuition</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-8 text-center text-muted-foreground"
                >
                  No approved enrollments found
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {payment.student.id}
                  </TableCell>
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
                        router.push(`/payments/${payment.id}/payment`)
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
      <DataTablePagination page={page} totalPages={totalPages} />
    </div>
  );
}
