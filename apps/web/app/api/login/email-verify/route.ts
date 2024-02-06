import { NextRequest } from "next/server";
import { renderLoginCode } from "@repo/email";
import { prisma } from "@/libs/prisma";
import { sendMail } from "@/libs/utils";
import { invalidBody, success } from "@/libs/http";
import { genEmailVerificationCode } from "@/libs/auth";
import { EmailVerifyPostValidator } from "@repo/schema";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = EmailVerifyPostValidator.safeParse(body);

  if (!validation.success) {
    return invalidBody();
  }

  let user = await prisma.user.findUnique({
    where: {
      email: validation.data.email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: validation.data.email,
      },
    });
  }

  const code = await genEmailVerificationCode(user.id, validation.data.email);

  // send email
  await sendMail({
    to: validation.data.email,
    subject: "Your Login Code",
    html: renderLoginCode({
      email: validation.data.email,
      code: code,
      url: "",
    }),
  });

  return success();
};
