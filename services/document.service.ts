import prisma from "@/lib/prisma";

export type SearchDocumentResult = Awaited<ReturnType<typeof searchDocument>>;

export async function searchDocument(
  q: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const skip = (page - 1) * pageSize;
  const where = q
    ? { name: { contains: q }, inactive: false }
    : { inactive: false };

  const [find, total] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.document.count({ where }),
  ]);

  return { documents: find, total, page, pageSize };
}

export async function createDocument(input: { name: string; description?: string }) {
  return await prisma.document.create({ data: input });
}

export async function updateDocument(id: number, input: { name?: string; description?: string }) {
  return await prisma.document.update({ where: { id }, data: input });
}

export async function deleteDocument(id: number) {
  await prisma.document.update({ where: { id }, data: { inactive: true } });
}

export async function findDocumentByName(name: string) {
  return await prisma.document.findFirst({ where: { name, inactive: false } });
}

export type SearchInactiveDocumentResult = Awaited<
  ReturnType<typeof searchInactiveDocument>
>;

export async function searchInactiveDocument(
  q: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const skip = (page - 1) * pageSize;
  const where = q
    ? { name: { contains: q }, inactive: true }
    : { inactive: true };

  const [find, total] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.document.count({ where }),
  ]);

  return { documents: find, total, page, pageSize };
}

export async function undoDocument(id: number) {
  await prisma.document.update({
    where: { id },
    data: { inactive: false },
  });
}
