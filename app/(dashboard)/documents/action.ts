"use server";

import { revalidatePath } from "next/cache";
import { registrarActionClient } from "@/lib/safe-action";
import z from "zod";
import { zfd } from "zod-form-data";
import { deleteDocument, updateDocument } from "@/services/document.service";

const updateDocumentActionInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
  name: z.string().optional(),
  description: z.string().optional(),
});

export const updateDocumentAction = registrarActionClient
  .inputSchema(updateDocumentActionInputSchema)
  .action(async ({ parsedInput: { id, name, description } }) => {
    await updateDocument(id, { name, description });
    revalidatePath("/documents");
    return { success: true };
  });

export const deleteDocumentAction = registrarActionClient
  .inputSchema(zfd.formData({ id: zfd.numeric(z.number()) }))
  .action(async ({ parsedInput: { id } }) => {
    await deleteDocument(id);
    revalidatePath("/documents");
    return { success: true };
  });
