"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { updateEnrollmentSettings } from "@/services/enrollment-settings.service";

const updateEnrollmentSettingsInputSchema = zfd.formData({
  grade1_curriculum_id: zfd.numeric(z.number()).nullable().optional(),
  grade2_curriculum_id: zfd.numeric(z.number()).nullable().optional(),
  grade3_curriculum_id: zfd.numeric(z.number()).nullable().optional(),
  grade4_curriculum_id: zfd.numeric(z.number()).nullable().optional(),
  grade5_curriculum_id: zfd.numeric(z.number()).nullable().optional(),
  grade6_curriculum_id: zfd.numeric(z.number()).nullable().optional(),
  is_online_enrollment_enabled: z.stringbool(),
});

export const updateEnrollmentSettingsAction = actionClient
  .inputSchema(updateEnrollmentSettingsInputSchema)
  .action(async ({ parsedInput }) => {
    await updateEnrollmentSettings({
      grade1_curriculum_id: parsedInput.grade1_curriculum_id ?? null,
      grade2_curriculum_id: parsedInput.grade2_curriculum_id ?? null,
      grade3_curriculum_id: parsedInput.grade3_curriculum_id ?? null,
      grade4_curriculum_id: parsedInput.grade4_curriculum_id ?? null,
      grade5_curriculum_id: parsedInput.grade5_curriculum_id ?? null,
      grade6_curriculum_id: parsedInput.grade6_curriculum_id ?? null,
      is_online_enrollment_enabled: parsedInput.is_online_enrollment_enabled,
    });

    revalidatePath("/enrollment-settings");
    return { success: true };
  });
