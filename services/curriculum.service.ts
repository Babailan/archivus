import { CurriculumFindManyArgs } from "@/app/generated/prisma/models";
import prisma from "@/lib/dbClient";

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
