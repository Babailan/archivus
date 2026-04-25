import { Metadata } from "next";
import { EnrollmentSettingsForm } from "./enrollment-settings-form";
import {
  getCurriculumsByGradeLevel,
  getEnrollmentSettings,
} from "@/services/enrollment-settings.service";

export const metadata: Metadata = {
  title: "Enrollment Settings",
};

export default async function EnrollmentSettingsPage() {
  const [settings, curriculums] = await Promise.all([
    getEnrollmentSettings(),
    getCurriculumsByGradeLevel(),
  ]);

  return (
    <div className="p-10">
      <EnrollmentSettingsForm settings={settings} curriculums={curriculums} />
    </div>
  );
}
