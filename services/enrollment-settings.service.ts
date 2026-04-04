import prisma from "@/lib/dbClient";

export type EnrollmentSettingsWithCurriculums = Awaited<
  ReturnType<typeof getEnrollmentSettings>
>;

export async function getEnrollmentSettings() {
  const settings = await prisma.enrollmentSettings.findFirst({
    include: {
      grade1_curriculum: {
        select: {
          id: true,
          curriculum_code: true,
          curriculum_name: true,
          grade_level: true,
        },
      },
      grade2_curriculum: {
        select: {
          id: true,
          curriculum_code: true,
          curriculum_name: true,
          grade_level: true,
        },
      },
      grade3_curriculum: {
        select: {
          id: true,
          curriculum_code: true,
          curriculum_name: true,
          grade_level: true,
        },
      },
      grade4_curriculum: {
        select: {
          id: true,
          curriculum_code: true,
          curriculum_name: true,
          grade_level: true,
        },
      },
      grade5_curriculum: {
        select: {
          id: true,
          curriculum_code: true,
          curriculum_name: true,
          grade_level: true,
        },
      },
      grade6_curriculum: {
        select: {
          id: true,
          curriculum_code: true,
          curriculum_name: true,
          grade_level: true,
        },
      },
    },
  });

  return settings;
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

export type UpdateEnrollmentSettingsInput = {
  grade1_curriculum_id: number | null;
  grade2_curriculum_id: number | null;
  grade3_curriculum_id: number | null;
  grade4_curriculum_id: number | null;
  grade5_curriculum_id: number | null;
  grade6_curriculum_id: number | null;
  is_online_enrollment_enabled: boolean;
};

export async function updateEnrollmentSettings(
  input: UpdateEnrollmentSettingsInput,
) {
  const existingSettings = await prisma.enrollmentSettings.findFirst();

  if (existingSettings) {
    return await prisma.enrollmentSettings.update({
      where: { id: existingSettings.id },
      data: {
        grade1_curriculum_id: input.grade1_curriculum_id,
        grade2_curriculum_id: input.grade2_curriculum_id,
        grade3_curriculum_id: input.grade3_curriculum_id,
        grade4_curriculum_id: input.grade4_curriculum_id,
        grade5_curriculum_id: input.grade5_curriculum_id,
        grade6_curriculum_id: input.grade6_curriculum_id,
        is_online_enrollment_enabled: input.is_online_enrollment_enabled,
      },
    });
  }

  return await prisma.enrollmentSettings.create({
    data: {
      grade1_curriculum_id: input.grade1_curriculum_id,
      grade2_curriculum_id: input.grade2_curriculum_id,
      grade3_curriculum_id: input.grade3_curriculum_id,
      grade4_curriculum_id: input.grade4_curriculum_id,
      grade5_curriculum_id: input.grade5_curriculum_id,
      grade6_curriculum_id: input.grade6_curriculum_id,
      is_online_enrollment_enabled: input.is_online_enrollment_enabled,
    },
  });
}
