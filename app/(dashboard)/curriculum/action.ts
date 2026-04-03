"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { searchCurriculum } from "@/services/curriculum.service";
import prisma from "@/lib/dbClient";
import { revalidatePath } from "next/cache";
import { GradeLevelEnum } from "@/app/generated/prisma/enums";
import { returnValidationErrors } from "next-safe-action";

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
        } catch (e) {
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

export const updateCurriculum = actionClient
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
      const existingCurriculum = await prisma.curriculum.findUnique({
        where: { id },
        include: {
          curriculum_subjects: true,
        },
      });

      if (!existingCurriculum) {
        return { success: false, error: "Curriculum not found" };
      }

      const existingSubjectIds = existingCurriculum.curriculum_subjects.map(
        (cs) => cs.subject_id,
      );
      const newSubjectIds = subjects.map((s) => s.subject_id);

      const subjectsToDelete = existingSubjectIds.filter(
        (sid) => !newSubjectIds.includes(sid),
      );
      const subjectsToAdd = newSubjectIds.filter(
        (sid) => !existingSubjectIds.includes(sid),
      );

      await prisma.$transaction([
        prisma.curriculum.update({
          where: { id },
          data: {
            curriculum_name,
            curriculum_code,
            grade_level,
            miscellaneous_fee,
          },
        }),
        prisma.curriculumSubjects.deleteMany({
          where: {
            curriculum_id: id,
            subject_id: { in: subjectsToDelete },
          },
        }),
        ...subjectsToAdd.map((subjectId) => {
          const subject = subjects.find((s) => s.subject_id === subjectId)!;
          return prisma.curriculumSubjects.create({
            data: {
              curriculum_id: id,
              subject_id: subjectId,
              subject_price_id: subject.subjectPrice_id,
            },
          });
        }),
      ]);

      revalidatePath("/curriculum");
      return { success: true };
    },
  );
