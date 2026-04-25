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
  getStudentByEnrollmentId,
  updateStudent,
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

export async function getEnrollments(status?: string, q?: string, page?: number) {
  return await searchEnrollments(status, q, page);
}

export async function getEnrollmentById(id: number) {
  return await getEnrollment(id);
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
