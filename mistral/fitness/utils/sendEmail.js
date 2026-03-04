import "dotenv/config";

import nodemailer from "nodemailer";

export async function sendEmail(text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_APP_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.GMAIL_APP_USER,
    to: process.env.GMAIL_APP_USER,
    subject: `Coach Notes`,
    text,
  });

  console.log("Message sent: %s", info.messageId);
}
