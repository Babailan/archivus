import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function anyAmountHelper() {
  return z.number({ error: "Amount is required." }).refine(
    (v) => {
      const vString = v.toString().split(".");
      if (vString.length - 1 && vString[1].length > 2) {
        return false;
      }
      return true;
    },
    { error: "Up to 2 decimals only." },
  );
}

export const stripEmpty = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  return schema.transform((val) =>
    Object.fromEntries(Object.entries(val).filter(([_, v]) => v != null)),
  );
};

export function queryFirst(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}
