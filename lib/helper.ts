import z from "@/node_modules/zod/v4/classic/external.cjs";

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
export function queryFirst(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export function generateReferenceCode(year: string, id: number): string {
  return `EN-${year.substring(2, 4)}${id.toString().padStart(6, "0")}`;
}

export function generateNextCustomId(year: string, lastId: number | null): number {
  const prefix = parseInt(year);
  const startId = prefix * 100000 + 1; // e.g., 202600001

  if (!lastId || lastId < startId) {
    return startId;
  }

  return lastId + 1;
}
