"use server";

import { Roles } from "@/app/generated/prisma/enums";
import { actionClient } from "@/lib/safe-action";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import z from "zod";
import { zfd } from "zod-form-data";
import {
  getUserByEmail,
  getUserByUsername,
  toggleUserStatus,
} from "@/services/user.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { GenderEnum } from "@/app/generated/prisma/enums";

const updateUserInputSchema = zfd.formData({
  id: zfd.numeric(z.number()),
  username: zfd.text(z.string({ error: "Username is required" })),
  email: zfd.text(z.string({ error: "Email is required" })),
  password: zfd.text(z.string().optional()),
  first_name: zfd.text(z.string({ error: "First name is required" })),
  last_name: zfd.text(z.string({ error: "Last name is required" })),
  middle_name: zfd.text(z.string().optional()),
  gender: zfd.text(z.nativeEnum(GenderEnum)),
  birthdate: zfd.text(z.preprocess((val) => new Date(val as string), z.date())),
  roles: zfd.text(
    z
      .string()
      .transform((str, ctx) => {
        try {
          return JSON.parse(str);
        } catch {
          ctx.addIssue({
            code: "custom",
            message: "Invalid roles format",
          });
          return z.NEVER;
        }
      })
      .pipe(
        z
          .array(z.enum(Object.values(Roles)))
          .min(1, "At least one role is required."),
      ),
  ),
});

export const updateUserAction = actionClient
  .inputSchema(updateUserInputSchema)
  .action(async ({ parsedInput: { id, username, email, password, roles } }) => {
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!existingUser) {
      return returnValidationErrors(updateUserInputSchema, {
        username: {
          _errors: ["User not found"],
        },
      });
    }

    const existingUsername = await getUserByUsername(username);
    if (existingUsername && existingUsername.id !== id) {
      return returnValidationErrors(updateUserInputSchema, {
        username: {
          _errors: ["Username already exists"],
        },
      });
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail && existingEmail.id !== id) {
      return returnValidationErrors(updateUserInputSchema, {
        email: {
          _errors: ["Email already exists"],
        },
      });
    }

    try {
      let hashedPassword = existingUser.hash_password;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id },
          data: {
            username,
            email,
            hash_password: hashedPassword,
            first_name,
            last_name,
            middle_name,
            gender,
            birthdate,
          },
        }),
        prisma.role.deleteMany({
          where: { user_id: id },
        }),
        prisma.role.createMany({
          data: roles.map((role) => ({
            user_id: id,
            role,
          })),
        }),
      ]);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return returnValidationErrors(updateUserInputSchema, {
            username: {
              _errors: ["Username already exists"],
            },
          });
        }
      }
      throw err;
    }

    revalidatePath("/users");
    return { success: true };
  });

export const toggleUserStatusAction = actionClient
  .inputSchema(zfd.formData({ id: zfd.numeric() }))
  .action(async ({ parsedInput: { id } }) => {
    await toggleUserStatus(id);
    revalidatePath("/users");
    revalidatePath("/users/inactive");
    return { success: true };
  });
