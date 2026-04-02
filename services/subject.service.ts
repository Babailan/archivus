import { SubjectFindManyArgs } from "@/app/generated/prisma/models";
import prisma from "@/lib/dbClient";

export type GetSubjectResult = Awaited<ReturnType<typeof getSubject>>;

export async function getSubject(q: string) {
  const select: SubjectFindManyArgs = {};
  if (q) {
    select.where = {
      subject_name: { search: q + "*" },
      subject_code: { search: q + "*" },
    };
    select.orderBy = {
      _relevance: {
        fields: ["subject_name", "subject_code"],
        search: q,
        sort: "desc",
      },
    };
  }

  let find = await prisma.subject.findMany({
    ...select,
    include: {
      prices: {
        take: 1,
        orderBy: {
          created_at: "desc",
        },
      },
    },
    take: 10,
  });

  return {
    subjects: find.map((v) => ({
      ...v,
      prices: v.prices.map((p) => ({ ...p, price: p.price.toNumber() })),
    })),
    hasMore: true,
  };
}
