import {
  SubjectFindManyArgs,
  SubjectUpdateInput,
} from "@/app/generated/prisma/models";
import prisma from "@/lib/prisma";

export type SearchSubjectResult = Awaited<ReturnType<typeof searchSubject>>;

export async function searchSubject(
  q: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const skip = (page - 1) * pageSize;

  const select: SubjectFindManyArgs = {};
  if (q) {
    select.where = {
      OR: [
        { subject_name: { contains: q } },
        { subject_code: { contains: q } },
      ],
      inactive: false,
    };
    select.orderBy = {
      created_at: "desc",
    };
  } else {
    select.where = { inactive: false };
    select.orderBy = {
      created_at: "desc",
    };
  }

  const [find, total] = await Promise.all([
    prisma.subject.findMany({
      where: { inactive: false },
      ...select,
      include: {
        prices: {
          take: 1,
          orderBy: {
            created_at: "desc",
          },
        },
      },
      skip,
      take: pageSize,
    }),
    prisma.subject.count({ where: select.where }),
  ]);

  return {
    subjects: find.map((v) => ({
      ...v,
      prices: v.prices.map((p) => ({ ...p, price: p.price.toNumber() })),
    })),
    total,
    page,
    pageSize,
  };
}

export type CreateSubjectInput = {
  subject_name: string;
  subject_code: string;
  price: number;
};

export async function createSubject(input: CreateSubjectInput) {
  return await prisma.subject.create({
    data: {
      subject_name: input.subject_name,
      subject_code: input.subject_code,
      prices: { create: { price: input.price } },
    },
  });
}

export type UpdateSubjectInput = {
  id: number;
  subject_code?: string;
  subject_name?: string;
  price?: number;
};

export async function updateSubject(input: UpdateSubjectInput) {
  const data: SubjectUpdateInput = {};
  if (input.subject_code) {
    data.subject_code = input.subject_code;
  }
  if (input.subject_name) {
    data.subject_name = input.subject_name;
  }
  if (input.price) {
    data.prices = { create: { price: input.price } };
  }
  return await prisma.subject.update({
    where: { id: input.id },
    data,
  });
}

export async function deleteSubject(id: number) {
  await prisma.subject.update({
    where: { id },
    data: { inactive: true },
  });
}

export async function findSubjectByCode(subject_code: string) {
  return await prisma.subject.findUnique({
    where: { subject_code },
  });
}
