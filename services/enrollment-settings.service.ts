import prisma from "@/lib/dbClient";
import { GradeLevelEnum } from "@/app/generated/prisma/enums";

export type EnrollmentSettingsWithCurriculums = Awaited<
  ReturnType<typeof getEnrollmentSettings>
>;

export async function getEnrollmentSettings() {
  const settings = await prisma.enrollmentSettings.findFirst();
  if (!settings) return null;

  const gradeCurriculumSettings = await prisma.gradeCurriculumSetting.findMany({
    where: { school_year: settings.school_year },
    include: {
      curriculum: {
        select: {
          id: true,
          curriculum_code: true,
          curriculum_name: true,
          grade_level: true,
        },
      },
    },
  });

  return {
    ...settings,
    grade_curriculum_settings: gradeCurriculumSettings,
  };
}

export async function getCurriculumsByGradeLevel() {
  const curriculums = await prisma.curriculum.findMany({
    where: { inactive: false },
    select: {
      id: true,
      curriculum_code: true,
      curriculum_name: true,
      grade_level: true,
    },
    orderBy: [{ grade_level: "asc" }, { curriculum_name: "asc" }],
  });

  return curriculums;
}

export async function getCurriculumByGradeAndYear(
  gradeLevel: string,
  schoolYear: string,
) {
  const setting = await prisma.gradeCurriculumSetting.findFirst({
    where: {
      grade_level: gradeLevel as GradeLevelEnum,
      school_year: schoolYear,
    },
    include: {
      curriculum: true,
    },
  });

  return setting?.curriculum ?? null;
}

export type UpdateEnrollmentSettingsInput = {
  school_year: string;
  grade_curriculum_settings: {
    grade_level: string;
    curriculum_id: number | null;
  }[];
  is_online_enrollment_enabled: boolean;
};

export async function updateEnrollmentSettings(
  input: UpdateEnrollmentSettingsInput,
) {
  return await prisma.$transaction(async (tx) => {
    const existingSettings = await tx.enrollmentSettings.findFirst();

    if (existingSettings) {
      await tx.enrollmentSettings.update({
        where: { id: existingSettings.id },
        data: {
          school_year: input.school_year,
          is_online_enrollment_enabled: input.is_online_enrollment_enabled,
        },
      });

      for (const gcs of input.grade_curriculum_settings) {
        if (gcs.curriculum_id === null) {
          await tx.gradeCurriculumSetting.deleteMany({
            where: {
              school_year: input.school_year,
              grade_level: gcs.grade_level as GradeLevelEnum,
            },
          });
        } else {
          await tx.gradeCurriculumSetting.upsert({
            where: {
              school_year_grade_level: {
                school_year: input.school_year,
                grade_level: gcs.grade_level as GradeLevelEnum,
              },
            },
            create: {
              school_year: input.school_year,
              grade_level: gcs.grade_level as GradeLevelEnum,
              curriculum_id: gcs.curriculum_id,
            },
            update: {
              curriculum_id: gcs.curriculum_id,
            },
          });
        }
      }

      const gradeCurriculumSettings = await tx.gradeCurriculumSetting.findMany({
        where: { school_year: input.school_year },
        include: {
          curriculum: {
            select: {
              id: true,
              curriculum_code: true,
              curriculum_name: true,
              grade_level: true,
            },
          },
        },
      });

      return {
        ...existingSettings,
        school_year: input.school_year,
        is_online_enrollment_enabled: input.is_online_enrollment_enabled,
        grade_curriculum_settings: gradeCurriculumSettings,
      };
    }

    const createdSettings = await tx.enrollmentSettings.create({
      data: {
        school_year: input.school_year,
        is_online_enrollment_enabled: input.is_online_enrollment_enabled,
      },
    });

    for (const gcs of input.grade_curriculum_settings) {
      if (gcs.curriculum_id !== null) {
        await tx.gradeCurriculumSetting.create({
          data: {
            school_year: input.school_year,
            grade_level: gcs.grade_level as GradeLevelEnum,
            curriculum_id: gcs.curriculum_id,
          },
        });
      }
    }

    const gradeCurriculumSettings = await tx.gradeCurriculumSetting.findMany({
      where: { school_year: input.school_year },
      include: {
        curriculum: {
          select: {
            id: true,
            curriculum_code: true,
            curriculum_name: true,
            grade_level: true,
          },
        },
      },
    });

    return {
      ...createdSettings,
      grade_curriculum_settings: gradeCurriculumSettings,
    };
  });
}
