import { Unsend } from "unsend";
import { db } from "./db";

interface SendMail {
  email: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
}

async function sendMail({ email, subject, html, text, from }: SendMail) {
  const apiKey = process.env.UNSEND_KEY || "";
  if (!apiKey) {
    throw new Error("UNSEND_KEY is not set");
  }
  const url = process.env.UNSEND_URL || "";
  if (!url) {
    throw new Error("UNSEND_URL is not set");
  }
  const unsend = new Unsend(apiKey, url);
  const { data: emailSent, error } = await unsend.emails.send({
    to: email,
    from: from || "system@myfinances.codefirst.me",
    subject: subject,
    html,
    text,
  });
  if (error) {
    throw error;
  }
  return emailSent;
}

export async function sendVerificationTokenEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const verificationUrl = new URL(
    `/auth/verify-email?token=${token}`,
    process.env.BASE_URL || ""
  );
  const html = `<p>Click <a href="${verificationUrl}">here</a> to verify your email</p>`;
  const text = `Click here to verify your email: ${verificationUrl}`;
  const emailSent = await sendMail({
    email,
    subject: "Verify your email",
    html,
    text,
  });

  const userEmail = await db.user.findUnique({
    where: { email },
  });
  if (!userEmail) {
    throw new Error("Email user not found");
  }
  await db.verificationEmail.create({
    data: {
      to: email,
      dateSent: new Date(),
      provider: "SELF_UNSEND",
      providerId: emailSent?.emailId,
      verificationToken: {
        connect: {
          identifier_token: {
            identifier: userEmail.id,
            token: token,
          },
        },
      },
    },
  });
}
