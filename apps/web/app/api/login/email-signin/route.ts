import { checkEmailVerificationCode, lucia } from "@/libs/auth";
import { invalidBody, notAllowed, success } from "@/libs/http";
import { EmailSignInPostValidator } from "@repo/schema";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = EmailSignInPostValidator.safeParse(body);

  if (!validation.success) {
    return invalidBody();
  }

  const valid = await checkEmailVerificationCode(
    validation.data.code,
    validation.data.email
  );

  if (!valid) {
    return notAllowed();
  }

  const session = await lucia.createSession(valid.userId, {});
  const cookie = lucia.createSessionCookie(session.id);

  return success(null, {
    headers: {
      "Set-Cookie": cookie.serialize(),
    },
  });
};
