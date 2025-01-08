import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn: async ({ user, credentials }) => {
      console.log("Sign in callback", { user, credentials });
      if (credentials) {
        const existingUser = await db?.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!existingUser || !existingUser.emailVerified) return false;
      }
      return true;
    },
  },
  ...authConfig,
});
