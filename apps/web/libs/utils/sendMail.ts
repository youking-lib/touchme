import nodemailer from "nodemailer";

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: "smtp.feishu.cn",
  port: 465,
  secure: true,
  auth: {
    user: "touchme-noreply@microvoid.io",
    pass: "GRZ5yXbuzoIykV6f",
  },
});

export function sendMail(options: SendMailOptions) {
  return transporter.sendMail({
    from: "touchme-noreply@touchme.pro",
    ...options,
  });
}
