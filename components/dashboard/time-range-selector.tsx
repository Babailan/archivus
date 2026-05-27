"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimeRange = "3" | "6" | "12";

export function TimeRangeSelector({
  defaultValue = "6",
}: {
  defaultValue?: TimeRange;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentRange = (searchParams.get("range") as TimeRange) || defaultValue;

  const handleValueChange = (value: string | null) => {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", value);
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Time Range:</span>
      <Select value={currentRange} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="3">Last 3 months</SelectItem>
          <SelectItem value="6">Last 6 months</SelectItem>
          <SelectItem value="12">Last 12 months</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
