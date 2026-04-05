"use server";

import { cashierActionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import {
  createRollbackRequest,
  cancelRollbackRequest,
  getPaymentHistory,
} from "@/services/rollback.service";
import { revalidatePath } from "next/cache";

const requestRollbackInputSchema = zfd.formData({
  payment_id: zfd.numeric(z.number()),
  reason: zfd.text(z.string().min(1)),
});

export const requestRollbackAction = cashierActionClient
  .inputSchema(requestRollbackInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      await createRollbackRequest({
        payment_id: parsedInput.payment_id,
        reason: parsedInput.reason,
      });
      revalidatePath("/enrollments");
      return { success: true };
    } catch (error) {
      return { error: (error as Error).message };
    }
  });

const cancelRollbackInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
});

export const cancelRollbackAction = cashierActionClient
  .inputSchema(cancelRollbackInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      await cancelRollbackRequest(parsedInput.id);
      revalidatePath("/enrollments");
      return { success: true };
    } catch (error) {
      return { error: (error as Error).message };
    }
  });

export async function getPaymentHistoryAction(enrollmentId: number) {
  return await getPaymentHistory(enrollmentId);
}
