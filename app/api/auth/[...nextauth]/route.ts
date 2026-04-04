import prisma from "@/lib/dbClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import z from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      roles: string[];
    };
  }
  interface User {
    roles?: string[];
    id: string;
  }
}
export const authOption: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { type: "text" },
        password: { type: "text" },
      },
      // ... your existing authorize logic
      async authorize(credentials, req) {
        // Mocking a successful user fetch for this example
        // Ensure your actual logic returns the user object with the id
        const user = {
          id: "user_123",
          name: "J Smith",
          email: "jsmith@example.com",
          roles: ["admin"],
        };
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 'user' is only available the first time the JWT is created (on login)
      if (user) {
        token.id = user.id;
        token.roles = user.roles || [];
      }
      return token;
    },
    async session({ session, token }) {
      // Transfer the data from the token to the session object
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
const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
