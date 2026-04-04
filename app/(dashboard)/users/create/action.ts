"use server";

import { Roles } from "@/app/generated/prisma/enums";
import { actionClient, adminActionClient } from "@/lib/safe-action";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import z from "zod";
import { zfd } from "zod-form-data";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "@/services/user.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const createUserInputSchema = zfd.formData({
  username: zfd.text(z.string({ error: "Username is required" })),
  email: zfd.text(z.string({ error: "Email is required" })),
  password: zfd.text(z.string({ error: "Password is required" })),
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

export const createUserAction = adminActionClient
  .inputSchema(createUserInputSchema)
  .action(async ({ parsedInput: { username, email, password, roles } }) => {
    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return returnValidationErrors(createUserInputSchema, {
        username: {
          _errors: ["Username already exists"],
        },
      });
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return returnValidationErrors(createUserInputSchema, {
        email: {
          _errors: ["Email already exists"],
        },
      });
    }

    try {
      await createUser({ username, email, password, roles });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return returnValidationErrors(createUserInputSchema, {
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
