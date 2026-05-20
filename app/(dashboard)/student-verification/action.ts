"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import {
  approveStudentVerification,
  declineStudentVerification,
  getStudentVerificationById,
  searchStudentVerifications,
  updateStudentVerification,
} from "@/services/enrollment.service";

const updateStudentVerificationSchema = zfd.formData({
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

export const updateStudentVerificationAction = actionClient
  .inputSchema(updateStudentVerificationSchema)
  .action(async ({ parsedInput }) => {
    await updateStudentVerification(parsedInput.id, {
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
    revalidatePath("/student-verification");
    return { success: true };
  });
import { revalidatePath } from "next/cache";

const approveStudentVerificationSchema = zfd.formData({
  id: zfd.numeric(z.number()),
});

export const approveStudentVerificationAction = actionClient
  .inputSchema(approveStudentVerificationSchema)
  .action(async ({ parsedInput }) => {
    await approveStudentVerification(parsedInput.id);
    revalidatePath("/student-verification");
    revalidatePath("/students");
    revalidatePath("/enrollments");
    return { success: true };
  });

const declineStudentVerificationSchema = zfd.formData({
  id: zfd.numeric(z.number()),
});

export const declineStudentVerificationAction = actionClient
  .inputSchema(declineStudentVerificationSchema)
  .action(async ({ parsedInput }) => {
    await declineStudentVerification(parsedInput.id);
    revalidatePath("/student-verification");
    return { success: true };
  });

export async function fetchStudentVerifications(
  status?: string,
  page?: number,
  pageSize?: number,
  q?: string,
) {
  return await searchStudentVerifications(status as any, page, pageSize, q);
}

export async function fetchStudentVerificationById(id: number) {
  return await getStudentVerificationById(id);
}
