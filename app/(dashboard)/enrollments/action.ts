"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import {
  approveEnrollment,
  searchEnrollments,
  recordPayment,
  getEnrollment,
  getStudentByEnrollmentId,
  updateStudent,
  dropEnrollment,
} from "@/services/enrollment.service";
import { revalidatePath } from "next/cache";

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

const dropEnrollmentInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
});

export const dropEnrollmentAction = actionClient
  .inputSchema(dropEnrollmentInputSchema)
  .action(async ({ parsedInput }) => {
    await dropEnrollment(parsedInput.id);
    revalidatePath("/enrollments");
    return { success: true };
  });

export async function getEnrollments(
  status?: string,
  q?: string,
  page?: number,
) {
  return await searchEnrollments(status, q, page);
}

const updateStudentInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
  first_name: zfd.text(z.string().min(1)),
  last_name: zfd.text(z.string().min(1)),
  middle_name: zfd.text(z.string().min(1)),
  date_of_birth: zfd.text(z.string().min(1)),
  address: zfd.text(z.string().min(1)),
  gender: zfd.text(z.enum(["male", "female"])),
  email: zfd.text(z.string().email()),
});

export const updateStudentAction = actionClient
  .inputSchema(updateStudentInputSchema)
  .action(async ({ parsedInput }) => {
    await updateStudent({
      id: parsedInput.id,
      first_name: parsedInput.first_name,
      last_name: parsedInput.last_name,
      middle_name: parsedInput.middle_name,
      date_of_birth: parsedInput.date_of_birth,
      address: parsedInput.address,
      gender: parsedInput.gender,
      email: parsedInput.email,
    });
    revalidatePath("/enrollments");
    return { success: true };
  });

export async function getStudentByEnrollment(id: number) {
  console.log("Fetching student by enrollment ID:", id);
  return await getStudentByEnrollmentId(id);
}
