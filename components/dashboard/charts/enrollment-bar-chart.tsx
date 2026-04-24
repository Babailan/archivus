"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type EnrollmentTrend = {
  month: string;
  count: number;
};

type Props = {
  data: EnrollmentTrend[];
  title?: string;
  description?: string;
};

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function EnrollmentBarChart({ data, title = "Enrollment Trends", description = "Number of enrollments over time" }: Props) {
  const totalEnrollments = data.reduce((sum, d) => sum + d.count, 0);
  const firstCount = data[0]?.count || 0;
  const lastCount = data[data.length - 1]?.count || 0;
  const percentChange = firstCount > 0 ? ((lastCount - firstCount) / firstCount * 100).toFixed(1) : "0";
  const isTrendingUp = lastCount >= firstCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-enrollments)" radius={8} name="Enrollments">
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {isTrendingUp ? "Trending up" : "Trending down"} by {percentChange}% this period <TrendingUp className={`h-4 w-4 ${isTrendingUp ? "" : "rotate-180"}`} />
        </div>
        <div className="leading-none text-muted-foreground">
          {totalEnrollments} total enrollments for the selected year
        </div>
      </CardFooter>
    </Card>
  );
}