"use server";

import { revalidatePath } from "next/cache";
import { registrarActionClient } from "@/lib/safe-action";
import z from "zod";
import { zfd } from "zod-form-data";
import { restoreSubject } from "@/services/subject.service";

export const restoreSubjectAction = registrarActionClient
  .inputSchema(zfd.formData({ id: zfd.numeric(z.number()) }))
  .action(async ({ parsedInput: { id } }) => {
    await restoreSubject(id);
    revalidatePath("/subjects/inactive");
    revalidatePath("/subjects");
    return { success: true };
  });
