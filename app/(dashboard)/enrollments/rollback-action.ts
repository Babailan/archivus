"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import {
  createEnrollmentRollbackRequest,
  cancelEnrollmentRollbackRequest,
  approveEnrollmentRollbackRequest,
  denyEnrollmentRollbackRequest,
  getEnrollmentRollbackRequests,
} from "@/services/rollback.service";
import { revalidatePath } from "next/cache";

const createEnrollmentRollbackSchema = zfd.formData({
  enrollment_id: zfd.numeric(z.number()),
  reason: zfd.text(z.string().min(10, "Reason must be at least 10 characters")),
});

export const createEnrollmentRollbackAction = actionClient
  .inputSchema(createEnrollmentRollbackSchema)
  .action(async ({ parsedInput }) => {
    try {
      await createEnrollmentRollbackRequest({
        enrollment_id: parsedInput.enrollment_id,
        reason: parsedInput.reason,
      });
      revalidatePath("/enrollments");
      revalidatePath(`/enrollments/${parsedInput.enrollment_id}/student`);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

const cancelEnrollmentRollbackSchema = zfd.formData({
  id: zfd.numeric(z.number()),
  enrollment_id: zfd.numeric(z.number()),
});

export const cancelEnrollmentRollbackAction = actionClient
  .inputSchema(cancelEnrollmentRollbackSchema)
  .action(async ({ parsedInput }) => {
    try {
      await cancelEnrollmentRollbackRequest(parsedInput.id);
      revalidatePath("/enrollments");
      revalidatePath(`/enrollments/${parsedInput.enrollment_id}/student`);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

const reviewEnrollmentRollbackSchema = zfd.formData({
  id: zfd.numeric(z.number()),
});

export const approveEnrollmentRollbackAction = actionClient
  .inputSchema(reviewEnrollmentRollbackSchema)
  .action(async ({ parsedInput }) => {
    try {
      await approveEnrollmentRollbackRequest(parsedInput.id);
      revalidatePath("/rollback-requests");
      revalidatePath("/enrollment-rollback-requests");
      revalidatePath("/enrollments");
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

export const denyEnrollmentRollbackAction = actionClient
  .inputSchema(reviewEnrollmentRollbackSchema)
  .action(async ({ parsedInput }) => {
    try {
      await denyEnrollmentRollbackRequest(parsedInput.id);
      revalidatePath("/rollback-requests");
      revalidatePath("/enrollment-rollback-requests");
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

export async function getEnrollmentRollbackRequestsAction(
  status?: string,
  page?: number,
  q?: string,
) {
  return await getEnrollmentRollbackRequests(status, page, 10, q);
}
