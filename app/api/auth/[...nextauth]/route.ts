import prisma from "@/lib/dbClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import z from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "text" },
      },

      async authorize(credentials, req) {
        const { data, success } = loginSchema.safeParse(credentials);
        if (success) {
          try {
            const user = await prisma.user.findUnique({
              where: { email: data.email },
            });
            if (user) {
              const password_match = await bcrypt.compare(
                data.password,
                user.hash_password,
              );
              if (!password_match) {
                return null;
              }
              return {
                id: user.id.toString(),
                name: user.username,
                email: user.email,
              };
            } else {
              return null;
            }
          } catch (error) {
            console.log(error);
            return null;
          }
        }
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
