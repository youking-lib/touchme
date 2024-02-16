import { invalidBody, success } from "@/libs/http";
import { getUploadedFileHash, getPreSignedPutUrl } from "@/libs/storage";
import { NextRequest } from "next/server";
import { HashSignPostValidator, HashSignPostOutput } from "@repo/schema";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = HashSignPostValidator.safeParse(body);

  if (!validation.success) {
    return invalidBody();
  }

  const fileHash = await getUploadedFileHash(validation.data.hash);

  if (fileHash) {
    const data: HashSignPostOutput = fileHash;
    return success(data);
  }

  const preSigned: HashSignPostOutput = await getPreSignedPutUrl(
    validation.data.filename
  );

  return success(preSigned);
};
