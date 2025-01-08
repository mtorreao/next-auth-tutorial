import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginSchema } from "./schemas";

export default {
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const dbUser = await prisma?.user.findUnique({
            where: { email },
          });
          if (!dbUser || !dbUser?.password) return null;
          const passwordsMatch = await bcrypt.compare(
            password,
            dbUser.password
          );
          if (passwordsMatch) {
            return dbUser;
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
