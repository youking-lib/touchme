import { EmailContants } from "@/libs/constant";
import nodemailer from "nodemailer";

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: EmailContants.HOST,
  port: EmailContants.PORT,
  secure: true,
  auth: {
    user: EmailContants.AUTH_USER,
    pass: EmailContants.AUTH_PASS,
  },
});

export function sendMail(options: SendMailOptions) {
  return transporter.sendMail({
    from: EmailContants.FROM,
    ...options,
  });
}
