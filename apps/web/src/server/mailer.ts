import nodemailer from "nodemailer";
import { env } from "@/lib/env";

interface sendMailProps {
  to: string;
  subject: string;
  text: string;
}

export async function sendMail({ to, subject, text }: sendMailProps) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_KEY,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  });
}
