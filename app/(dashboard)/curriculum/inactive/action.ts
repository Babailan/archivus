"use server";

import { revalidatePath } from "next/cache";
import { registrarActionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { undoCurriculum } from "@/services/curriculum.service";

export const restoreCurriculumAction = registrarActionClient
  .inputSchema(zfd.formData({ id: zfd.numeric(z.number()) }))
  .action(async ({ parsedInput: { id } }) => {
    await undoCurriculum(id);
    revalidatePath("/curriculum/inactive");
    revalidatePath("/curriculum");
    return { success: true };
  });
