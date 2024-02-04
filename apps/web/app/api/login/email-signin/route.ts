import { checkEmailVerificationCode, lucia } from "@/libs/auth";
import { invalidBody, notAllowed, success } from "@/libs/http";
import { NextRequest } from "next/server";
import { object, string } from "zod";

const Validator = {
  post: object({
    email: string(),
    code: string(),
  }),
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = Validator.post.safeParse(body);

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
