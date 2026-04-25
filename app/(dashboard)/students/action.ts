"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import {
  searchStudents,
  dropEnrollment,
} from "@/services/enrollment.service";
import { revalidatePath } from "next/cache";

const dropEnrollmentSchema = zfd.formData({
  id: zfd.numeric(z.number()),
});

export const dropEnrollmentAction = actionClient
  .inputSchema(dropEnrollmentSchema)
  .action(async ({ parsedInput }) => {
    await dropEnrollment(parsedInput.id);
    revalidatePath("/students");
    revalidatePath("/enrollments");
    return { success: true };
  });

export async function fetchStudents(
  q?: string,
  page?: number,
  pageSize?: number,
) {
  return await searchStudents(q, page, pageSize);
}
