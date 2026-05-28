"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecentPaymentsResult } from "@/services/payment.service";
import { use } from "react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { SearchInput } from "@/components/ui/search-input";

interface RecentPaymentsListProps {
  paymentsPromise: Promise<RecentPaymentsResult>;
}

export function RecentPaymentsList({
  paymentsPromise,
}: RecentPaymentsListProps) {
  const { payments, total, page, pageSize } = use(paymentsPromise);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <SearchInput
          pathname="/recent-payment"
          placeholder="Search by receipt no. or student name..."
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt No.</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>School Year</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No recent payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.receipt_no}
                  </TableCell>
                  <TableCell>
                    {payment.student.last_name}, {payment.student.first_name}
                  </TableCell>
                  <TableCell>{payment.grade_level}</TableCell>
                  <TableCell>{payment.school_year}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    ₱{payment.amount_paid.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(payment.payment_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
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
