"use server";

import { GradeLevelEnum } from "@/app/generated/prisma/enums";
import prisma from "@/lib/dbClient";
import { actionClient } from "@/lib/safe-action";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { zfd } from "zod-form-data";

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

export const createCurriculum = actionClient
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
        await prisma.curriculum.create({
          data: {
            curriculum_name,
            curriculum_code,
            grade_level,
            miscellaneous_fee,
            curriculum_subjects: {
              createMany: {
                data: subjects.map((subject) => ({
                  subject_id: subject.subject_id,
                  subject_price_id: subject.subjectPrice_id,
                })),
              },
            },
          },
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
      return { success: true };
    },
  );
