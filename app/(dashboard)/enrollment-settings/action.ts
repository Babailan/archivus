"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { updateEnrollmentSettings } from "@/services/enrollment-settings.service";

const updateEnrollmentSettingsInputSchema = zfd.formData({
  school_year: zfd.text(
    z
      .string({ error: "School year is required" })
      .regex(/^\d{4}-\d{4}$/, "Invalid school year format")
      .min(1, "School year is required"),
  ),
  grade1_curriculum_id: zfd.numeric(z.number()).nullable().optional(),
  grade2_curriculum_id: zfd.numeric(z.number()).nullable().optional(),
  grade3_curriculum_id: zfd.numeric(z.number()).nullable().optional(),
  grade4_curriculum_id: zfd.numeric(z.number()).nullable().optional(),
  grade5_curriculum_id: zfd.numeric(z.number()).nullable().optional(),
  grade6_curriculum_id: zfd.numeric(z.number()).nullable().optional(),
  is_online_enrollment_enabled: zfd.text(z.string()),
});

export const updateEnrollmentSettingsAction = actionClient
  .inputSchema(updateEnrollmentSettingsInputSchema)
  .action(async ({ parsedInput }) => {
    const gradeCurriculumSettings = [
      {
        grade_level: "grade1",
        curriculum_id: parsedInput.grade1_curriculum_id ?? null,
      },
      {
        grade_level: "grade2",
        curriculum_id: parsedInput.grade2_curriculum_id ?? null,
      },
      {
        grade_level: "grade3",
        curriculum_id: parsedInput.grade3_curriculum_id ?? null,
      },
      {
        grade_level: "grade4",
        curriculum_id: parsedInput.grade4_curriculum_id ?? null,
      },
      {
        grade_level: "grade5",
        curriculum_id: parsedInput.grade5_curriculum_id ?? null,
      },
      {
        grade_level: "grade6",
        curriculum_id: parsedInput.grade6_curriculum_id ?? null,
      },
    ];

    await updateEnrollmentSettings({
      school_year: parsedInput.school_year,
      grade_curriculum_settings: gradeCurriculumSettings,
      is_online_enrollment_enabled:
        parsedInput.is_online_enrollment_enabled === "true",
    });

    revalidatePath("/enrollment-settings");
    return { success: true };
  });
