"use server";

import { anyAmountHelper } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { actionClient, registrarActionClient } from "@/lib/safe-action";
import z from "zod";
import { zfd } from "zod-form-data";
import {
  deleteSubject,
  searchSubject,
  updateSubject,
} from "@/services/subject.service";

const updateSubjectActionInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
  subject_code: z.string().optional(),
  subject_name: z.string().optional(),
  price: zfd.numeric(anyAmountHelper()).optional(),
});

export const updateSubjectAction = registrarActionClient
  .inputSchema(updateSubjectActionInputSchema)
  .action(
    async ({ parsedInput: { id, subject_code, subject_name, price } }) => {
      await updateSubject({ id, subject_code, subject_name, price });
      revalidatePath("/subjects");
      return { success: true };
    },
  );

export const searchSubjectsAction = actionClient
  .inputSchema(zfd.formData({ q: z.string() }))
  .action(async ({ parsedInput: { q } }) => {
    return await searchSubject(q);
  });

export const deleteSubjectAction = registrarActionClient
  .inputSchema(zfd.formData({ id: zfd.numeric(z.number()) }))
  .action(async ({ parsedInput: { id } }) => {
    await deleteSubject(id);
    revalidatePath("/subjects");
    return { success: true };
  });
