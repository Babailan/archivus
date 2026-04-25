import prisma from "@/lib/prisma";
import { Roles, GenderEnum } from "@/app/generated/prisma/enums";
import bcrypt from "bcryptjs";
import { Prisma } from "@/app/generated/prisma/client";
import { generateNextCustomId } from "@/lib/helper";

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: GenderEnum;
  birthdate: Date;
  roles: Roles[];
};

export async function createUser(input: CreateUserInput) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(input.password, salt);

  const year = new Date().getFullYear().toString();
  const lastUser = await prisma.user.findFirst({
    where: { id: { gte: parseInt(year) * 100000 } },
    orderBy: { id: "desc" },
  });
  const nextUserId = generateNextCustomId(year, lastUser ? lastUser.id : null);

  return prisma.user.create({
    data: {
      id: nextUserId,
      username: input.username,
      email: input.email,
      hash_password: hashedPassword,
      first_name: input.first_name,
      last_name: input.last_name,
      middle_name: input.middle_name,
      gender: input.gender,
      birthdate: input.birthdate,
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

export async function searchUsers(
  q: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const skip = (page - 1) * pageSize;
  const where: Prisma.UserWhereInput = { inactive: false };

  if (q) {
    const chunks = q.trim().split(/\s+/).filter(Boolean);
    if (chunks.length > 0) {
      where.AND = chunks.map((chunk) => ({
        OR: [
          { username: { contains: chunk } },
          { email: { contains: chunk } },
          { first_name: { contains: chunk } },
          { last_name: { contains: chunk } },
          { middle_name: { contains: chunk } },
        ],
      }));
    }
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        role: true,
      },
      orderBy: { created_at: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.user.count({
      where,
    }),
  ]);

  return { users, total, page, pageSize };
}

export async function getInactiveUsers(
  page: number = 1,
  pageSize: number = 10,
) {
  const skip = (page - 1) * pageSize;
  const where: Prisma.UserWhereInput = { inactive: true };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        role: true,
      },
      orderBy: { created_at: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.user.count({
      where,
    }),
  ]);

  return { users, total, page, pageSize };
}

export async function toggleUserStatus(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { inactive: true },
  });

  if (!user) throw new Error("User not found");

  return prisma.user.update({
    where: { id },
    data: { inactive: !user.inactive },
  });
}
