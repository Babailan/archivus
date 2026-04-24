"use server";

import { getApprovedEnrollments } from "@/services/payment.service";

export async function getPayments(q?: string, page?: number) {
  return await getApprovedEnrollments(q, page);
}
