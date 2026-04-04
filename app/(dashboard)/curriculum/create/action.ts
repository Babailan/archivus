"use server";

import { GradeLevelEnum } from "@/app/generated/prisma/enums";
import { actionClient } from "@/lib/safe-action";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import z from "zod";
import { zfd } from "zod-form-data";
import { createCurriculum } from "@/services/curriculum.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const createCurriculumInputSchema = zfd.formData({
  curriculum_name: zfd.text(z.string({ error: "This field is required." })),
  curriculum_code: zfd.text(z.string({ error: "This field is required." })),
  grade_level: zfd.text(
    z.enum(Object.values(GradeLevelEnum), {
      error: "This field is required.",
    }),
  ),
  miscellaneous_fee: zfd.numeric(z.number()).default(0),
  subjects: zfd.text(
    z
      .string()
      .transform((str, ctx) => {
        try {
          return JSON.parse(str);
        } catch {
          ctx.addIssue({
            code: "custom",
            message: "Invalid JSON format",
          });
          return z.NEVER;
        }
      })
      .pipe(
        z
          .array(
            z.object({
              subjectPrice_id: z.number({
                error: "Subject Price ID is required",
              }),
              subject_id: z.number({ error: "Subject ID is required" }),
            }),
          )
          .min(1, "At least one subject is required."),
      ),
  ),
});

export const createCurriculumAction = actionClient
  .inputSchema(createCurriculumInputSchema)
  .action(
    async ({
      parsedInput: {
        subjects,
        curriculum_name,
        curriculum_code,
        grade_level,
        miscellaneous_fee,
      },
    }) => {
      try {
        await createCurriculum({
          subjects,
          curriculum_name,
          curriculum_code,
          grade_level: grade_level as GradeLevelEnum,
          miscellaneous_fee,
        });
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            return returnValidationErrors(createCurriculumInputSchema, {
              curriculum_code: {
                _errors: ["Curriculum Code already exists"],
              },
            });
          }
        }
      }
      revalidatePath("/curriculum");
      return { success: true };
    },
  );
