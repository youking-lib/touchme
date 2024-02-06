import { invalidBody, success } from "@/libs/http";
import { getOrSignFileHash } from "@/libs/storage";
import { NextRequest } from "next/server";
import { HashSignPostValidator, HashSignPostOutput } from "@repo/schema";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = HashSignPostValidator.safeParse(body);

  if (!validation.success) {
    return invalidBody();
  }

  const data: HashSignPostOutput = await getOrSignFileHash(
    validation.data.hash,
    validation.data.filename
  );

  return success(data);
};
