"use server";

import { SubjectUpdateInput } from "@/app/generated/prisma/models";
import prisma from "@/lib/dbClient";
import { actionClient } from "@/lib/safe-action";
import { anyAmountHelper } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import z from "zod";
import { zfd } from "zod-form-data";
import { getSubject } from "@/services/subject.service";

const updateSubjectActionInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
  subject_code: z.string().optional(),
  subject_name: z.string().optional(),
  price: zfd.numeric(anyAmountHelper()).optional(),
});

export const updateSubjectAction = actionClient
  .inputSchema(updateSubjectActionInputSchema)
  .action(
    async ({ parsedInput: { id, subject_code, subject_name, price } }) => {
      // some field can be undefined, so we need to check if it is undefined
      const data: SubjectUpdateInput = {};
      if (subject_code) {
        data.subject_code = subject_code;
      }
      if (subject_name) {
        data.subject_name = subject_name;
      }
      if (price) {
        data.prices = { create: { price } };
      }
      await prisma.subject.update({
        where: { id },
        data: data,
      });
      revalidatePath("/subjects");
      return {
        success: true,
      };
    },
  );

export const searchSubjectsAction = actionClient
  .inputSchema(zfd.formData({ q: z.string() }))
  .action(async ({ parsedInput: { q } }) => {
    return await getSubject(q);
  });

export const deleteSubjectAction = actionClient
  .inputSchema(zfd.formData({ id: zfd.numeric(z.number()) }))
  .action(async ({ parsedInput: { id } }) => {
    await prisma.subject.update({
      where: { id },
      data: { inactive: true },
    });
    revalidatePath("/subjects");
    return { success: true };
  });
