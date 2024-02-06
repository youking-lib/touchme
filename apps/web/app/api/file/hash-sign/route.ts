import { invalidBody, success } from "@/libs/http";
import { getOrSignFileHash } from "@/libs/storage";
import { NextRequest } from "next/server";
import { object, string } from "zod";

const Validator = {
  post: object({
    hash: string(),
    filename: string(),
  }),
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = Validator.post.safeParse(body);

  if (!validation.success) {
    return invalidBody();
  }

  const data = await getOrSignFileHash(
    validation.data.hash,
    validation.data.filename
  );

  return success(data);
};
