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
import { Badge } from "@/components/ui/badge";

type RecentRollback = {
  id: number;
  student: {
    first_name: string;
    last_name: string;
  };
  amount: number;
  reason: string;
  status: string;
  created_at: string;
};

type Props = {
  data: RecentRollback[];
  title?: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  denied: "bg-red-500",
  cancelled: "bg-gray-500",
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

export function RecentRollbacksTable({
  data,
  title = "Recent Rollback Requests",
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
              <TableHead>Student Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No rollback requests
                </TableCell>
              </TableRow>
            ) : (
              data.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    {request.student.last_name}, {request.student.first_name}
                  </TableCell>
                  <TableCell className="font-medium text-red-600">
                    {formatCurrency(request.amount)}
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={request.reason}
                  >
                    {request.reason}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={statusColors[request.status] || "bg-gray-500"}
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(request.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
