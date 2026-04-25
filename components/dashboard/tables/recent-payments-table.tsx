"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RecentPayment = {
  id: number;
  receipt_no: string;
  student: {
    first_name: string;
    last_name: string;
  };
  amount_paid: number;
  payment_date: string;
};

type Props = {
  data: RecentPayment[];
  title?: string;
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export function RecentPaymentsTable({
  data,
  title = "Recent Payments",
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt No.</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No recent payments
                </TableCell>
              </TableRow>
            ) : (
              data.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.receipt_no}
                  </TableCell>
                  <TableCell>
                    {payment.student.last_name}, {payment.student.first_name}
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(payment.amount_paid)}
                  </TableCell>
                  <TableCell>{formatDate(payment.payment_date)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
