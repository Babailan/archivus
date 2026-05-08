"use server";

import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { createEnrollment } from "@/services/enrollment.service";
import { getEnrollmentSettings } from "@/services/enrollment-settings.service";

const submitEnrollmentInputSchema = zfd.formData({
  first_name: zfd.text(z.string().min(1, "First name is required")),
  last_name: zfd.text(z.string().min(1, "Last name is required")),
  middle_name: zfd.text(z.string().min(1, "Middle name is required")),
  date_of_birth: zfd.text(z.string().min(1, "Date of birth is required")),
  gender: zfd.text(z.enum(["male", "female"])),
  grade_level: zfd.text(z.string().min(1, "Grade level is required")),
  address: zfd.text(z.string().min(1, "Address is required")),
  email: zfd.text(z.string().email("Invalid email address")),
});

export const submitEnrollmentAction = actionClient
  .inputSchema(submitEnrollmentInputSchema)
  .action(async ({ parsedInput }) => {
    const settings = await getEnrollmentSettings();
    if (!settings) {
      return { success: false, error: "Enrollment settings not found" };
    }

    try {
      const result = await createEnrollment({
        first_name: parsedInput.first_name,
        last_name: parsedInput.last_name,
        middle_name: parsedInput.middle_name,
        date_of_birth: new Date(parsedInput.date_of_birth),
        gender: parsedInput.gender as "male" | "female",
        grade_level: parsedInput.grade_level,
        address: parsedInput.address,
        email: parsedInput.email,
        school_year: settings.school_year,
      });

      return { success: true, referenceCode: result.reference_code };
    } catch (error) {
      console.log(error);
      return { success: false, error: "Failed to submit enrollment" };
    }
  });
