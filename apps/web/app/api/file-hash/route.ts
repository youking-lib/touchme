import { invalidBody, success } from "@/libs/http";
import { hashFile } from "@/libs/storage";
import { FileHashPostValidator, FileHashPostOutput } from "@repo/schema";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = FileHashPostValidator.safeParse(body);

  if (!validation.success) {
    return invalidBody();
  }

  const filehash: FileHashPostOutput = await hashFile(validation.data.key);
  return success(filehash);
};
