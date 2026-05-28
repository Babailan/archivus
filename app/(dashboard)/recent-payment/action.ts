"use server";

import { getRecentPayments } from "@/services/payment.service";

export async function getPayments(q?: string, page?: number) {
  return await getRecentPayments(q, page);
}
