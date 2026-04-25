import { Metadata } from "next";
import { EnrollmentForm } from "./enrollment-form";
import { getEnrollmentSettings } from "@/services/enrollment-settings.service";

export const metadata: Metadata = {
  title: "Enrollment",
};

export default async function EnrollmentPage() {
  const settings = await getEnrollmentSettings();

  if (!settings || !settings.is_online_enrollment_enabled) {
    return (
      <div className="px-10 py-2 mb-10">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-2">
            Online Enrollment is Currently Disabled
          </h1>
          <p className="text-muted-foreground">
            Please check back later or contact the school for more information.
          </p>
        </div>
      </div>
    );
  }

  const gradeCurriculumMap = new Map(
    settings.grade_curriculum_settings.map((gcs) => [
      gcs.grade_level,
      gcs.curriculum_id,
    ]),
  );

  const gradeLevels = [
    {
      value: "grade1",
      label: "Grade 1",
      curriculumId: gradeCurriculumMap.get("grade1") ?? null,
    },
    {
      value: "grade2",
      label: "Grade 2",
      curriculumId: gradeCurriculumMap.get("grade2") ?? null,
    },
    {
      value: "grade3",
      label: "Grade 3",
      curriculumId: gradeCurriculumMap.get("grade3") ?? null,
    },
    {
      value: "grade4",
      label: "Grade 4",
      curriculumId: gradeCurriculumMap.get("grade4") ?? null,
    },
    {
      value: "grade5",
      label: "Grade 5",
      curriculumId: gradeCurriculumMap.get("grade5") ?? null,
    },
    {
      value: "grade6",
      label: "Grade 6",
      curriculumId: gradeCurriculumMap.get("grade6") ?? null,
    },
  ].filter((g) => g.curriculumId !== null);

  if (gradeLevels.length === 0) {
    return (
      <div className="px-10 py-2 mb-10">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-2">
            No Grade Levels Available for Enrollment
          </h1>
          <p className="text-muted-foreground">
            Please contact the school for more information.
          </p>
        </div>
      </div>
    );
  }

  return <EnrollmentForm gradeLevels={gradeLevels} />;
}
