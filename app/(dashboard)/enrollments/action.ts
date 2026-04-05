"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import {
  declineEnrollment,
  approveEnrollment,
  searchEnrollments,
  recordPayment,
  getEnrollment,
} from "@/services/enrollment.service";
import { revalidatePath } from "next/cache";

const declineEnrollmentInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
});

export const declineEnrollmentAction = actionClient
  .inputSchema(declineEnrollmentInputSchema)
  .action(async ({ parsedInput }) => {
    await declineEnrollment(parsedInput.id);
    revalidatePath("/enrollments");
    return { success: true };
  });

const approveEnrollmentInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
});

export const approveEnrollmentAction = actionClient
  .inputSchema(approveEnrollmentInputSchema)
  .action(async ({ parsedInput }) => {
    await approveEnrollment(parsedInput.id);
    revalidatePath("/enrollments");
    return { success: true };
  });

const recordPaymentInputSchema = zfd.formData({
  enrollment_id: zfd.numeric(z.number()),
  amount_paid: zfd.numeric(z.number()),
  payment_method: zfd.text(z.string().min(1)),
  receipt_no: zfd.text(z.string().min(1)),
});

export const recordPaymentAction = actionClient
  .inputSchema(recordPaymentInputSchema)
  .action(async ({ parsedInput }) => {
    const result = await recordPayment({
      enrollment_id: parsedInput.enrollment_id,
      amount_paid: parsedInput.amount_paid,
      payment_method: parsedInput.payment_method,
      receipt_no: parsedInput.receipt_no,
    });
    revalidatePath("/enrollments");
    return { success: true, isFullyPaid: result.isFullyPaid };
  });

export async function getEnrollments(status?: string) {
  return await searchEnrollments(status);
}

export async function getEnrollmentById(id: number) {
  return await getEnrollment(id);
}
