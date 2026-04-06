import prisma from "@/lib/prisma";
import { Roles } from "@/app/generated/prisma/enums";
import bcrypt from "bcryptjs";

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
  roles: Roles[];
};

export async function createUser(input: CreateUserInput) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(input.password, salt);

  return prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      hash_password: hashedPassword,
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

export type UserWithRoles = Awaited<ReturnType<typeof getUser>>;

export async function getUser(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
    },
  });

  if (!user) return null;

  return {
    ...user,
    roles: user.role.map((r) => r.role),
  };
}

export type SearchUserResult = Awaited<ReturnType<typeof searchUsers>>;

export async function searchUsers(q: string) {
  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [{ username: { contains: q } }, { email: { contains: q } }],
        }
      : undefined,
    include: {
      role: true,
    },
    orderBy: { created_at: "desc" },
  });
  return { users };
}
