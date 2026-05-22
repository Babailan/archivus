"use server";

import { actionClient, cashierActionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import {
  createRollbackRequest,
  cancelRollbackRequest,
  getPaymentHistory,
} from "@/services/rollback.service";
import { revalidatePath } from "next/cache";
import { getEnrollment, recordPayment } from "@/services/enrollment.service";

const requestRollbackInputSchema = zfd.formData({
  payment_id: zfd.numeric(z.number()),
  reason: zfd.text(z.string().min(1)),
});

const recordPaymentInputSchema = zfd.formData({
  enrollment_id: zfd.numeric(z.number()),
  amount_paid: zfd.numeric(z.number()),
  receipt_no: zfd.text(z.string().min(1)),
});

export const recordPaymentAction = actionClient
  .inputSchema(recordPaymentInputSchema)
  .action(async ({ parsedInput }) => {
    const result = await recordPayment({
      enrollment_id: parsedInput.enrollment_id,
      amount_paid: parsedInput.amount_paid,
      receipt_no: parsedInput.receipt_no,
    });
    revalidatePath("/enrollments");
    return { success: true, isFullyPaid: result.isFullyPaid };
  });
export async function getEnrollmentById(id: number) {
  return await getEnrollment(id);
}

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
