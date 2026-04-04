"use server";

import { actionClient, registrarActionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { GradeLevelEnum } from "@/app/generated/prisma/enums";
import {
  createCurriculum,
  deleteCurriculum,
  searchCurriculum,
  updateCurriculum,
} from "@/services/curriculum.service";

export const searchCurriculumAction = actionClient
  .inputSchema(zfd.formData({ q: z.string() }))
  .action(async ({ parsedInput: { q } }) => {
    return await searchCurriculum(q);
  });

export const deleteCurriculumAction = registrarActionClient
  .inputSchema(zfd.formData({ id: zfd.numeric(z.number()) }))
  .action(async ({ parsedInput: { id } }) => {
    await deleteCurriculum(id);
    revalidatePath("/curriculum");
    return { success: true };
  });

const editCurriculumInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
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

export const updateCurriculumAction = registrarActionClient
  .inputSchema(editCurriculumInputSchema)
  .action(
    async ({
      parsedInput: {
        id,
        subjects,
        curriculum_name,
        curriculum_code,
        grade_level,
        miscellaneous_fee,
      },
    }) => {
      try {
        await updateCurriculum({
          id,
          subjects,
          curriculum_name,
          curriculum_code,
          grade_level: grade_level as GradeLevelEnum,
          miscellaneous_fee,
        });
      } catch (error) {
        if (error instanceof Error) {
          return { success: false, error: error.message };
        }
      }
      revalidatePath("/curriculum");
      return { success: true };
    },
  );
