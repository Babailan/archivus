"use server";

import { getApprovedEnrollments } from "@/services/payment.service";

export async function getPayments(q?: string) {
  return await getApprovedEnrollments(q);
}
