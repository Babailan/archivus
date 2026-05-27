"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import {
  searchStudents,
  dropEnrollment,
  createEnrollmentForStudent,
} from "@/services/enrollment.service";
import { updateStudentWithDocuments } from "@/services/student.service";
import { getEnrollmentSettings } from "@/services/enrollment-settings.service";
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

const updateStudentDetailSchema = zfd.formData({
  id: zfd.numeric(z.number()),
  first_name: zfd.text(z.string().min(1)),
  last_name: zfd.text(z.string().min(1)),
  middle_name: zfd.text(z.string().min(0).optional().default("")),
  date_of_birth: zfd.text(z.string().min(1)),
  address: zfd.text(z.string().min(1)),
  gender: zfd.text(z.enum(["male", "female"])),
  email: zfd.text(z.string().email()),
  document_ids: zfd.repeatable(z.array(zfd.numeric()).optional().default([])),
});

export const updateStudentDetailAction = actionClient
  .inputSchema(updateStudentDetailSchema)
  .action(async ({ parsedInput }) => {
    await updateStudentWithDocuments({
      id: parsedInput.id,
      first_name: parsedInput.first_name,
      last_name: parsedInput.last_name,
      middle_name: parsedInput.middle_name,
      date_of_birth: parsedInput.date_of_birth,
      address: parsedInput.address,
      gender: parsedInput.gender,
      email: parsedInput.email,
      document_ids: parsedInput.document_ids,
    });
    revalidatePath("/students");
    revalidatePath(`/students/${parsedInput.id}`);
    return { success: true };
  });

export async function fetchStudents(
  q?: string,
  page?: number,
  pageSize?: number,
) {
  return await searchStudents(q, page, pageSize);
}

const createEnrollmentSchema = zfd.formData({
  student_id: zfd.numeric(z.number()),
  grade_level: zfd.text(z.string()),
  school_year: zfd.text(z.string()),
});

export const createEnrollmentAction = actionClient
  .inputSchema(createEnrollmentSchema)
  .action(async ({ parsedInput }) => {
    await createEnrollmentForStudent({
      student_id: parsedInput.student_id,
      grade_level: parsedInput.grade_level as any,
      school_year: parsedInput.school_year,
    });
    revalidatePath(`/students/${parsedInput.student_id}`);
    revalidatePath("/enrollments");
    return { success: true };
  });

export async function getEnrollmentData() {
  return await getEnrollmentSettings();
}
