"use server";

import prisma from "@/app/libs/dbClient";

export async function searchSubjectAction(q: string) {
  // If q is empty, we pass an empty object to 'where' to return the first 5 subjects

  const pageSize = 10;

  const searchFilter =
    q.length > 0
      ? {
          OR: [{ subject_name: q }, { subject_code: q }],
        }
      : {};

  const data = await prisma.subject.findMany({
    where: searchFilter,
    take: pageSize + 1,
    orderBy: { subject_name: "asc" },
  });

  return { results: data };
}
