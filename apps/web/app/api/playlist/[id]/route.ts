import { invalidBody, notFound, success } from "@/libs/http";
import { prisma } from "@/libs/prisma";
import { PlaylistSchema } from "@repo/schema";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, params: { id: string }) => {
  const validation = PlaylistSchema.Validator.GetItemInput.safeParse(params);

  if (!validation.success) {
    return invalidBody();
  }

  const playlist = await prisma.playlist.findUnique({
    where: {
      id: validation.data.id,
    },
    include: {
      user: true,
      tracks: {
        include: {
          file: {
            select: {
              id: true,
              hash: true,
              key: true,
            },
          },
        },
      },
    },
  });

  if (!playlist) {
    return notFound();
  }

  return success<PlaylistSchema.GetItem["Output"]>(playlist);
};
