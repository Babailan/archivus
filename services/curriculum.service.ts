import { CurriculumFindManyArgs } from "@/app/generated/prisma/models";
import prisma from "@/lib/dbClient";

export async function getCurriculum(id: number) {
  const curriculum = await prisma.curriculum.findUnique({
    where: {
      id,
    },
    include: {
      curriculum_subjects: true,
    },
  });

  const {
    _sum: { price },
  } = await prisma.subjectPrice.aggregate({
    _sum: {
      price: true,
    },
    where: {
      curriculumSubjects: {
        some: {
          curriculum_id: id,
        },
      },
    },
  });

  return {
    curriculum,
    price:
      (price?.toNumber() ?? 0) +
      (curriculum?.miscellaneous_fee.toNumber() ?? 0),
  };
}

export type SearchSubjectResult = Awaited<ReturnType<typeof searchCurriculum>>;

export async function searchCurriculum(q: string) {
  const select: CurriculumFindManyArgs = {};
  if (q) {
    select.where = {
      curriculum_name: { search: q + "*" },
      curriculum_code: { search: q + "*" },
      inactive: false,
    };
    select.orderBy = {
      _relevance: {
        fields: ["curriculum_code", "curriculum_name"],
        search: q,
        sort: "desc",
      },
    };
  } else {
    // order by created_at desc if empty string
    select.orderBy = {
      created_at: "desc",
    };
  }

  let find = await prisma.curriculum.findMany({
    where: {
      inactive: false,
    },
    ...select,
    take: 10,
  });

  const curriculums = find.map((c) => ({
    ...c,
    miscellaneous_fee: c.miscellaneous_fee.toNumber(),
  }));

  return {
    curriculums,
    hasMore: true,
  };
}
