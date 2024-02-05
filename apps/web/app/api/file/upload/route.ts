import { NextRequest } from "next/server";
import { getSessionUser } from "@/libs/auth";
import { upload } from "@/libs/storage";
import { invalidBody, success } from "@/libs/http";

export const POST = async (req: NextRequest) => {
  const form = await req.formData();
  const file = form.get("file") as File;

  if (!file) {
    return invalidBody();
  }

  const user = await getSessionUser();
  const res = await upload(file, user?.id);

  return success(res);
};
