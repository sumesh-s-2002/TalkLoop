import nodemailer from "nodemailer"
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: env.smptp_host,
  port: env.smtp_port,
  secure: env.smtp_port == 465,
  auth: {
    user: env.smptp_user,
    pass: env.smtp_pass,
  },
});

export async function sendVerificationEmail(to, link, text) {
  try {
    const info = await transporter.sendMail({
      from: env.mail_from,
      to: to,
      subject: text,
      html: `<p>Pleae click to verify:</p><a href="${link}">${link}</a>`,
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err);
    throw new Error("Email sending failed");
  }
}
