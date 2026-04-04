"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { anyAmountHelper } from "@/lib/utils";
import { createSubject, findSubjectByCode } from "@/services/subject.service";
import { returnValidationErrors } from "next-safe-action";

const createSubjectInputSchema = zfd.formData({
  subject_name: zfd.text(z.string({ error: "Subject name is required." })),
  subject_code: zfd.text(z.string({ error: "Subject code is required." })),
  price: zfd.numeric(anyAmountHelper()),
});

export const createSubjectAction = actionClient
  .inputSchema(createSubjectInputSchema)
  .action(async ({ parsedInput: { price, subject_code, subject_name } }) => {
    const subjectExist = await findSubjectByCode(subject_code);
    if (subjectExist) {
      return returnValidationErrors(createSubjectInputSchema, {
        subject_code: { _errors: ["Subject Code exist already."] },
      });
    }
    await createSubject({ price, subject_code, subject_name });
    return { success: true };
  });
