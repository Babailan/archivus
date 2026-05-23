"use client";

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";

type EnrollmentStatusData = {
  status: string;
  count: number;
};

type Props = {
  data: EnrollmentStatusData[];
  title?: string;
};

const statusColors: Record<string, string> = {
  Approved: "var(--chart-2)",
  Dropped: "var(--destructive)",
};

const chartConfig = {
  status0: { label: "Approved", color: "var(--chart-2)" },
  status1: { label: "Dropped", color: "var(--destructive)" },
};

export function EnrollmentPieChart({
  data,
  title = "Enrollments by Status",
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={statusColors[entry.status] || "var(--muted-foreground)"}
                />
              ))}
            </Pie>
            <ChartTooltipContent
              nameKey="status"
              formatter={(value, name) => [value, name]}
            />
            <ChartLegend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
