"use server";

import { db } from "@/lib/db";

export async function verifyToken({ token }: { token: string }) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const existingToken = await db.verificationToken.findFirst({
    where: { token },
  });
  if (!existingToken) return { success: false, error: "Token not found" };
  if (existingToken.expires < new Date())
    return { success: false, error: "Token expired" };
  await db.user.update({
    where: { id: existingToken.identifier },
    data: { emailVerified: new Date() },
  });
  return { success: true };
}
