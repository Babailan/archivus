"use client";

import { NumericFormat, NumericFormatProps } from "react-number-format";

interface CurrencyProps extends Omit<NumericFormatProps, "displayType" | "prefix" | "thousandSeparator"> {
  value: number | string | undefined;
  className?: string;
}

export function Currency({ value, className, ...props }: CurrencyProps) {
  return (
    <NumericFormat
      value={value}
      displayType="text"
      prefix="₱ "
      thousandSeparator
      className={className}
      {...props}
    />
  );
}
