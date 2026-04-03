"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { searchCurriculum } from "@/services/curriculum.service";
import prisma from "@/lib/dbClient";
import { revalidatePath } from "next/cache";

export const searchCurriculumAction = actionClient
  .inputSchema(zfd.formData({ q: z.string() }))
  .action(async ({ parsedInput: { q } }) => {
    return await searchCurriculum(q);
  });

export const deleteCurriculumAction = actionClient
  .inputSchema(zfd.formData({ id: zfd.numeric(z.number()) }))
  .action(async ({ parsedInput: { id } }) => {
    await prisma.curriculum.update({
      where: { id },
      data: { inactive: true },
    });
    revalidatePath("/curriculum");
    return { success: true };
  });
