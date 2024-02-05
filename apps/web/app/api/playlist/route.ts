import { NextRequest } from "next/server";
import { object, string } from "zod";

import { invalidBody, success } from "@/libs/http";
import { prisma } from "@/libs/prisma";
import { getSessionUser } from "@/libs/auth";

const ValidatorSchema = {
  post: object({
    name: string(),
  }),
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = ValidatorSchema.post.safeParse(body);

  if (!validation.success) {
    return invalidBody();
  }

  const loginUser = await getSessionUser();
  const playlist = await prisma.playlist.create({
    data: {
      name: validation.data.name,
      userId: loginUser?.id,
    },
  });

  return success(playlist);
};
