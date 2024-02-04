import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { prisma } from "../prisma";

export async function genEmailVerificationCode(
  userId: string,
  email: string
): Promise<string> {
  const code = generateRandomString(8, alphabet("0-9"));

  await prisma.emailVerificationCode.create({
    data: {
      code,
      userId,
      email,
      expiresAt: createDate(new TimeSpan(5, "m")), // 5 minutes
    },
  });

  return code;
}

export async function checkEmailVerificationCode(code: string, email: string) {
  const data = await prisma.emailVerificationCode.findFirst({
    where: {
      code,
      email,
    },
  });

  if (data && data.expiresAt.getTime() > Date.now()) {
    return data;
  }

  return null;
}
