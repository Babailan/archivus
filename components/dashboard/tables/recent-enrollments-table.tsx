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

type RecentEnrollment = {
  id: number;
  reference_code: string;
  student: {
    first_name: string;
    last_name: string;
  };
  grade_level: string;
  status: string;
  created_at: string;
};

type Props = {
  data: RecentEnrollment[];
  title?: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  declined: "bg-red-500",
  dropped: "bg-gray-500",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RecentEnrollmentsTable({ data, title = "Recent Enrollments" }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference Code</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No recent enrollments
                </TableCell>
              </TableRow>
            ) : (
              data.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="font-medium">{enrollment.reference_code}</TableCell>
                  <TableCell>
                    {enrollment.student.last_name}, {enrollment.student.first_name}
                  </TableCell>
                  <TableCell>{enrollment.grade_level.toUpperCase()}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[enrollment.status] || "bg-gray-500"}>
                      {enrollment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(enrollment.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}