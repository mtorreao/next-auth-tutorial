"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { sendVerificationTokenEmail } from "@/lib/mail";
import { LOGIN_REDIRECT_ROUTE } from "@/routes";
import { Login, LoginSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function login(data: Login) {
  const parsedData = LoginSchema.safeParse(data);
  if (!parsedData.success) {
    return { error: parsedData.error.errors[0].message };
  }
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: LOGIN_REDIRECT_ROUTE,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        case "AccessDenied":
          return await verifyAccessDeniedError({
            email: data.email,
          });
        default:
          return { error: "An error occurred" };
      }
    }
    throw error;
  }
}

export async function loginWithSocial(provider: string) {
  try {
    await signIn(provider);
  } catch (error) {
    console.log("Error signing in with social provider", error);
    throw error;
  }
}

async function verifyAccessDeniedError({ email }: { email: string }) {
  const existingUser = await db.user.findUnique({
    where: { email },
  });
  if (existingUser && existingUser.password) {
    const token = await bcrypt.hash(email, 10);
    const verificationToken = await db.verificationToken.create({
      data: {
        identifier: existingUser.id,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    await sendVerificationTokenEmail({
      email: existingUser.email,
      token: verificationToken.token,
    });
    return { error: "Account not verified. A new email sent." };
  }
  return { error: "Something went wrong" };
}
