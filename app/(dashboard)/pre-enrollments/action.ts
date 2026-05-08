"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import {
  approvePreEnrollment,
  declinePreEnrollment,
  getPreEnrollments,
  getPreEnrollmentById,
  updatePreEnrollment,
} from "@/services/enrollment.service";

const updatePreEnrollmentSchema = zfd.formData({
  id: zfd.numeric(z.number()),
  first_name: zfd.text(),
  last_name: zfd.text(),
  middle_name: zfd.text(),
  date_of_birth: zfd.text(),
  gender: zfd.text(),
  address: zfd.text(),
  email: zfd.text(),
  grade_level: zfd.text(),
  school_year: zfd.text(),
});

export const updatePreEnrollmentAction = actionClient
  .inputSchema(updatePreEnrollmentSchema)
  .action(async ({ parsedInput }) => {
    await updatePreEnrollment(parsedInput.id, {
      first_name: parsedInput.first_name,
      last_name: parsedInput.last_name,
      middle_name: parsedInput.middle_name,
      date_of_birth: new Date(parsedInput.date_of_birth),
      gender: parsedInput.gender as "male" | "female",
      address: parsedInput.address,
      email: parsedInput.email,
      grade_level: parsedInput.grade_level as any,
      school_year: parsedInput.school_year,
    });
    revalidatePath("/pre-enrollments");
    return { success: true };
  });
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

export async function fetchPreEnrollmentById(id: number) {
  return await getPreEnrollmentById(id);
}
