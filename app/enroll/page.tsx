import { EnrollmentForm } from "./enrollment-form";
import { getEnrollmentSettings } from "@/services/enrollment-settings.service";

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

  const gradeLevels = [
    {
      value: "grade1",
      label: "Grade 1",
      curriculumId: settings.grade1_curriculum_id,
    },
    {
      value: "grade2",
      label: "Grade 2",
      curriculumId: settings.grade2_curriculum_id,
    },
    {
      value: "grade3",
      label: "Grade 3",
      curriculumId: settings.grade3_curriculum_id,
    },
    {
      value: "grade4",
      label: "Grade 4",
      curriculumId: settings.grade4_curriculum_id,
    },
    {
      value: "grade5",
      label: "Grade 5",
      curriculumId: settings.grade5_curriculum_id,
    },
    {
      value: "grade6",
      label: "Grade 6",
      curriculumId: settings.grade6_curriculum_id,
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
