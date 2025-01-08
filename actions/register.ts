"use server";

import { db } from "@/lib/db";
import { sendVerificationTokenEmail } from "@/lib/mail";
import { Register, RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";

export async function register(data: Register) {
  const parsedData = RegisterSchema.safeParse(data);
  if (!parsedData.success) {
    return { error: parsedData.error.errors[0].message };
  }
  const hashedPass = await bcrypt.hash(data.password, 10);
  try {
    const existingUser = await db?.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return { error: "User already exists" };
    }
    const createdUser = await db?.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPass,
      },
    });
    const token = (await bcrypt.hash(data.email, 10)).slice(0, 30);
    const verificationToken = await db.verificationToken.create({
      data: {
        identifier: createdUser.id,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    await sendVerificationTokenEmail({
      email: data.email,
      token: verificationToken.token,
    });
    return { success: "User created. Email sent" };
  } catch (error) {
    console.log(error);
    return { error: "An error occurred" };
  }
}
