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

type PaymentTrend = {
  month: string;
  amount: number;
};

type Props = {
  data: PaymentTrend[];
  title?: string;
  description?: string;
};

const chartConfig = {
  collections: {
    label: "Collections",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function PaymentTrendChart({
  data,
  title = "Payment Trends",
  description = "Payment collections over time",
}: Props) {
  const totalCollections = data.reduce((sum, d) => sum + d.amount, 0);
  const firstAmount = data[0]?.amount || 0;
  const lastAmount = data[data.length - 1]?.amount || 0;
  const percentChange =
    firstAmount > 0
      ? (((lastAmount - firstAmount) / firstAmount) * 100).toFixed(1)
      : "0";
  const isTrendingUp = lastAmount >= firstAmount;

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
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => [
                    `₱${Number(value).toLocaleString()}`,
                    "Collections",
                  ]}
                />
              }
            />
            <Bar
              dataKey="amount"
              fill="var(--color-collections)"
              radius={8}
              name="Collections"
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {isTrendingUp ? "Trending up" : "Trending down"} by {percentChange}%
          this period{" "}
          <TrendingUp
            className={`h-4 w-4 ${isTrendingUp ? "" : "rotate-180"}`}
          />
        </div>
        <div className="leading-none text-muted-foreground">
          Total: ₱{totalCollections.toLocaleString()} collected
        </div>
      </CardFooter>
    </Card>
  );
}
