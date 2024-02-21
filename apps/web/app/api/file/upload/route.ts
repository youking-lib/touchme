import { NextRequest } from "next/server";
import { getSessionUser } from "@/libs/auth";
import { getOrUploadFile } from "@/libs/storage";
import { invalidBody, success } from "@/libs/http";

export const POST = async (req: NextRequest) => {
  const form = await req.formData();
  const file = form.get("file") as File;

  if (!file) {
    return invalidBody();
  }

  const user = await getSessionUser();
  const buffer = await file.arrayBuffer();
  const res = await getOrUploadFile(buffer, file.name, user?.id);

  return success(res);
};
