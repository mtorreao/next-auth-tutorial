import { Unsend } from "unsend";

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
  try {
    await unsend.emails.send({
      to: email,
      from: from || "system@myfinances.codefirst.me",
      subject: subject,
      html,
      text,
    });
  } catch (error) {
    console.log("Error sending email", error);
  }
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
  return await sendMail({ email, subject: "Verify your email", html, text });
}
