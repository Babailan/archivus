import prisma from "@/lib/dbClient";
import { Roles } from "@/app/generated/prisma/enums";

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
  roles: Roles[];
};

export async function createUser(input: CreateUserInput) {
  return prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      hash_password: input.password,
      role: {
        create: input.roles.map((role) => ({ role })),
      },
    },
    include: {
      role: true,
    },
  });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export type SearchUserResult = Awaited<ReturnType<typeof searchUsers>>;

export async function searchUsers(q: string) {
  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { username: { search: q + "*" } },
            { email: { search: q + "*" } },
          ],
        }
      : undefined,
    include: {
      role: true,
    },
    orderBy: { created_at: "desc" },
  });
  return { users };
}
