"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import {
  approvePreEnrollment,
  declinePreEnrollment,
  getPreEnrollments,
} from "@/services/enrollment.service";
import { revalidatePath } from "next/cache";

const approvePreEnrollmentSchema = zfd.formData({
  id: zfd.numeric(z.number()),
});

export const approvePreEnrollmentAction = actionClient
  .inputSchema(approvePreEnrollmentSchema)
  .action(async ({ parsedInput }) => {
    await approvePreEnrollment(parsedInput.id);
    revalidatePath("/pre-enrollments");
    revalidatePath("/students");
    revalidatePath("/enrollments");
    return { success: true };
  });

const declinePreEnrollmentSchema = zfd.formData({
  id: zfd.numeric(z.number()),
});

export const declinePreEnrollmentAction = actionClient
  .inputSchema(declinePreEnrollmentSchema)
  .action(async ({ parsedInput }) => {
    await declinePreEnrollment(parsedInput.id);
    revalidatePath("/pre-enrollments");
    return { success: true };
  });

export async function fetchPreEnrollments(
  status?: string,
  page?: number,
  pageSize?: number,
) {
  return await getPreEnrollments(status as any, page, pageSize);
}
