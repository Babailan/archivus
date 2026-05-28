"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  GradeLevelEnum,
  StudentVerificationStatus,
} from "@/app/generated/prisma";
import {
  updateStudentVerification,
  searchStudentVerifications,
  approveStudentVerification,
  declineStudentVerification,
  getStudentVerificationById,
} from "@/services/student-verification.service";

const updateStudentVerificationSchema = zfd.formData({
  id: zfd.numeric(z.number()),
  first_name: zfd.text(),
  last_name: zfd.text(),
  middle_name: zfd.text(
    z.transform((v) => (v == undefined ? "" : v)).pipe(z.string()),
  ),
  date_of_birth: zfd.text(),
  gender: zfd.text(),
  address: zfd.text(),
  email: zfd.text(),
  grade_level: zfd.text(),
  school_year: zfd.text(),
  lrn: zfd.text(),
  contact_number: zfd.text(),
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
      grade_level: parsedInput.grade_level as GradeLevelEnum,
      school_year: parsedInput.school_year,
      lrn: parsedInput.lrn,
      contact_number: parsedInput.contact_number,
    });
    revalidatePath("/student-verification");
    return { success: true };
  });

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
  return await searchStudentVerifications(
    status as StudentVerificationStatus,
    page,
    pageSize,
    q,
  );
}

export async function fetchStudentVerificationById(id: number) {
  return await getStudentVerificationById(id);
}
