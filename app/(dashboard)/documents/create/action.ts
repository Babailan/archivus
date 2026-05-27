"use server";

import { z } from "zod";
import { registrarActionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import {
  createDocument,
  findDocumentByName,
} from "@/services/document.service";
import { returnValidationErrors } from "next-safe-action";

const createDocumentInputSchema = zfd.formData({
  name: zfd.text(z.string({ error: "Document name is required." })),
  description: z.string().optional(),
});

export const createDocumentAction = registrarActionClient
  .inputSchema(createDocumentInputSchema)
  .action(async ({ parsedInput: { name, description } }) => {
    const exist = await findDocumentByName(name);
    if (exist) {
      return returnValidationErrors(createDocumentInputSchema, {
        name: { _errors: ["Document name already exists."] },
      });
    }
    await createDocument({ name, description });
    return { success: true };
  });
