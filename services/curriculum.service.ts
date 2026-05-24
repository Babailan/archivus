import { CurriculumFindManyArgs } from "@/app/generated/prisma/models";
import prisma from "@/lib/prisma";
import { GradeLevelEnum } from "@/app/generated/prisma/enums";

export type CurriculumWithSubjects = Awaited<ReturnType<typeof getCurriculum>>;

export async function getCurriculum(id: number) {
  const curriculum = await prisma.curriculum.findUnique({
    where: {
      id,
      inactive: false,
    },
    include: {
      curriculum_subjects: {
        include: {
          subject: {
            include: {
              prices: true,
            },
          },
          subject_price: true,
        },
      },
    },
  });

  if (!curriculum) return null;

  return {
    ...curriculum,
    miscellaneous_fee: curriculum.miscellaneous_fee.toNumber(),
    curriculum_subjects: curriculum.curriculum_subjects.map((cs) => ({
      curriculum_id: cs.curriculum_id,
      subject_id: cs.subject_id,
      subject_name: cs.subject.subject_name,
      subject_code: cs.subject.subject_code,
      price: cs.subject_price.price.toNumber(),
      subject_price_id: cs.subject_price_id,
    })),
  };
}

export type SearchCurriculumResult = Awaited<
  ReturnType<typeof searchCurriculum>
>;

export async function searchCurriculum(
  q: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const skip = (page - 1) * pageSize;

  const chunks = q ? q.trim().split(/\s+/).filter(Boolean) : [];

  const searchFilter = q
    ? {
        OR: [
          ...chunks.map((chunk) => ({
            OR: [
              { curriculum_name: { contains: chunk, mode: "insensitive" as const } },
              { curriculum_code: { contains: chunk, mode: "insensitive" as const } },
            ],
          })),
        ],
      }
    : {};

  const where = { inactive: false, ...searchFilter };

  try {
    const [find, total] = await Promise.all([
      prisma.curriculum.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.curriculum.count({ where }),
    ]);

    const curriculums = find.map((c) => ({
      ...c,
      miscellaneous_fee: c.miscellaneous_fee.toNumber(),
    }));

    return {
      curriculums,
      total,
      page,
      pageSize,
    };
  } catch (error) {
    console.error("Full error:", error);
    if (error instanceof Error && "cause" in error) {
      console.error("Cause:", JSON.stringify(error.cause, null, 2));
    }
    throw error;
  }
}

export type CreateCurriculumInput = {
  curriculum_name: string;
  curriculum_code: string;
  grade_level: GradeLevelEnum;
  miscellaneous_fee: number;
  subjects: Array<{ subjectPrice_id: number; subject_id: number }>;
};

export async function createCurriculum(input: CreateCurriculumInput) {
  return await prisma.curriculum.create({
    data: {
      curriculum_name: input.curriculum_name,
      curriculum_code: input.curriculum_code,
      grade_level: input.grade_level,
      miscellaneous_fee: input.miscellaneous_fee,
      curriculum_subjects: {
        createMany: {
          data: input.subjects.map((subject) => ({
            subject_id: subject.subject_id,
            subject_price_id: subject.subjectPrice_id,
          })),
        },
      },
    },
  });
}

export type UpdateCurriculumInput = {
  id: number;
  curriculum_name: string;
  curriculum_code: string;
  grade_level: GradeLevelEnum;
  miscellaneous_fee: number;
  subjects: Array<{ subjectPrice_id: number; subject_id: number }>;
};

export async function updateCurriculum(input: UpdateCurriculumInput) {
  const existingCurriculum = await prisma.curriculum.findUnique({
    where: { id: input.id },
    include: {
      curriculum_subjects: true,
    },
  });

  if (!existingCurriculum) {
    throw new Error("Curriculum not found");
  }

  const existingSubjectIds = existingCurriculum.curriculum_subjects.map(
    (cs) => cs.subject_id,
  );
  const newSubjectIds = input.subjects.map((s) => s.subject_id);

  const subjectsToDelete = existingSubjectIds.filter(
    (sid) => !newSubjectIds.includes(sid),
  );
  const subjectsToAdd = newSubjectIds.filter(
    (sid) => !existingSubjectIds.includes(sid),
  );

  await prisma.$transaction([
    prisma.curriculum.update({
      where: { id: input.id },
      data: {
        curriculum_name: input.curriculum_name,
        curriculum_code: input.curriculum_code,
        grade_level: input.grade_level,
        miscellaneous_fee: input.miscellaneous_fee,
      },
    }),
    prisma.curriculumSubjects.deleteMany({
      where: {
        curriculum_id: input.id,
        subject_id: { in: subjectsToDelete },
      },
    }),
    ...subjectsToAdd.map((subjectId) => {
      const subject = input.subjects.find((s) => s.subject_id === subjectId)!;
      return prisma.curriculumSubjects.create({
        data: {
          curriculum_id: input.id,
          subject_id: subjectId,
          subject_price_id: subject.subjectPrice_id,
        },
      });
    }),
  ]);
}

export async function deleteCurriculum(id: number) {
  await prisma.curriculum.update({
    where: { id },
    data: { inactive: true },
  });
}
