import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/dbClient";
import Credentials from "next-auth/providers/credentials";
import z from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const authOption: NextAuthOptions = {
  providers: [
    Credentials({
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
              include:{
                role:true,
              }
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
                roles: user.role.map((r) => r.role),
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.roles = token.roles;
      }
      return session;
    },
  },
};

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: string[];
  }
}