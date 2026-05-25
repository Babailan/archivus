"use server";

import { revalidatePath } from "next/cache";
import { registrarActionClient } from "@/lib/safe-action";
import z from "zod";
import { zfd } from "zod-form-data";
import { undoDocument } from "@/services/document.service";

export const restoreDocumentAction = registrarActionClient
  .inputSchema(zfd.formData({ id: zfd.numeric(z.number()) }))
  .action(async ({ parsedInput: { id } }) => {
    await undoDocument(id);
    revalidatePath("/documents/inactive");
    revalidatePath("/documents");
    return { success: true };
  });
