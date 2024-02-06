import { NextRequest } from "next/server";

import { PlaylistPostValidator, PlaylistPostOutput } from "@repo/schema";
import { invalidBody, success } from "@/libs/http";
import { getSessionUser } from "@/libs/auth";
import { prisma } from "@/libs/prisma";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = PlaylistPostValidator.safeParse(body);

  if (!validation.success) {
    return invalidBody();
  }

  const loginUser = await getSessionUser();
  const playlist: PlaylistPostOutput = await prisma.playlist.create({
    data: {
      name: validation.data.name,
      userId: loginUser?.id,
    },
  });

  return success(playlist);
};
