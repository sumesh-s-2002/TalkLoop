import nodemailer from "nodemailer";
import { env } from "../config/env.js";

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

export async function sendTestMails(to, link, text) {
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Test" <test@example.com>`,
      to: to,
      subject: text,
      html: `<p>Pleae click to verify:</p><a href="${link}">${link}</a>`,
    });
  } catch (err) {
    console.error(`Failed to send the test mail tol:${to}`, err);
    throw err;
  } finally {
    transporter.close();
  }
}
