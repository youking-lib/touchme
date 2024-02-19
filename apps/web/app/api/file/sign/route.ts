import { invalidBody, success } from "@/libs/http";
import { getPreSignedGetUrlByFileId } from "@/libs/storage";
import { NextRequest } from "next/server";
import { FileSchema } from "@repo/schema";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = FileSchema.SignValidator.PostInput.safeParse(body);

  if (!validation.success) {
    return invalidBody();
  }

  const preSignedUrl = await getPreSignedGetUrlByFileId(validation.data.fileId);

  if (!preSignedUrl) {
    return invalidBody();
  }

  const data: FileSchema.SignPost["Output"] = {
    preSignedUrl,
  };

  return success(data);
};
