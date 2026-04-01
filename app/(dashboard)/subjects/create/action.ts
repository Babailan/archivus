"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { anyAmountHelper, sleep } from "@/lib/utils";
import prisma from "@/lib/dbClient";
import {
  flattenValidationErrors,
  returnValidationErrors,
} from "next-safe-action";

const createSubjectInputSchema = zfd.formData({
  subject_name: zfd.text(z.string({ error: "Subject name is required." })),
  subject_code: zfd.text(z.string({ error: "Subject code is required." })),
  price: zfd.numeric(anyAmountHelper()),
});

export const createSubject = actionClient
  .inputSchema(createSubjectInputSchema)
  .action(async ({ parsedInput: { price, subject_code, subject_name } }) => {
    const subjectExist = await prisma.subject.findUnique({
      where: { subject_code },
    });
    if (subjectExist) {
      returnValidationErrors(createSubjectInputSchema, {
        subject_code: { _errors: ["Subject Code exist already."] },
      });
    }
    await prisma.subject.create({
      data: { prices: { create: { price } }, subject_code, subject_name },
    });
    return { feedback: `Successfully created.` };
  });
