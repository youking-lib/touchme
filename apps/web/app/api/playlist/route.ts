import { NextRequest } from "next/server";

import { PlaylistSchema } from "@repo/schema";
import { invalidBody, success } from "@/libs/http";
import { getSessionUser } from "@/libs/auth";
import { prisma } from "@/libs/prisma";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = PlaylistSchema.Validator.PostInput.safeParse(body);

  if (!validation.success) {
    return invalidBody();
  }

  const loginUser = await getSessionUser();
  const playlist: PlaylistSchema.Post["Output"] = await prisma.playlist.create({
    data: {
      name: validation.data.name,
      userId: loginUser?.id,
    },
  });

  return success(playlist);
};

export const GET = async (req: NextRequest) => {
  const query = req.nextUrl.searchParams;
  const validation = PlaylistSchema.Validator.GetInput.safeParse({
    page: Number(query.get("page")) || 0,
    pageSize: Number(query.get("pageSize")) || 10,
    order: query.get("order"),
    orderBy: query.get("orderBy"),
  });

  if (!validation.success) {
    return invalidBody();
  }

  const playlists = await prisma.playlist.findMany({
    take: validation.data.pageSize,
    skip: validation.data.page * validation.data.pageSize,
    orderBy: validation.data.orderBy
      ? {
          [validation.data.orderBy]: validation.data.order,
        }
      : {},
    include: {
      user: true,
      PlaylistTrack: true,
    },
  });

  return success(playlists);
};
