"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Currency } from "@/components/ui/currency";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
  isCurrency?: boolean;
};

export function StatCard({
  title,
  value,
  subtitle,
  className,
  isCurrency,
}: StatCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground font-normal">
          {title}
        </CardTitle>
        <div className="text-3xl font-medium">
          {isCurrency ? <Currency value={value} /> : value}
        </div>
      </CardHeader>
      {subtitle && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardContent>
      )}
    </Card>
  );
}
