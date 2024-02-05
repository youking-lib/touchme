import { EmailContants } from "@/libs/constant";
import { createTransport } from "nodemailer";

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

const transporter = createTransport({
  host: EmailContants.HOST,
  port: Number(EmailContants.PORT),
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
