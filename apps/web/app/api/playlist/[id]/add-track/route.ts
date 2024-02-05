import { NextRequest } from "next/server";
import { invalidBody, notFound, success } from "@/libs/http";

import { array, number, object, string } from "zod";
import { prisma } from "@/libs/prisma";
import { trackFieldEncode } from "./format";

const ValidatorSchema = {
  post: object({
    playlistId: string(),
    album: string(),
    artist: array(string()),
    duration: number(),
    genre: array(string()).default([]),
    title: string(),
    fileId: string(),
  }),
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const validation = ValidatorSchema.post.safeParse(body);

  if (!validation.success) {
    return invalidBody();
  }

  const playlist = await prisma.playlist.findUnique({
    where: {
      id: validation.data.playlistId,
    },
  });

  if (!playlist) {
    return notFound();
  }

  const track = await prisma.playlistTrack.create({
    data: {
      playlistId: validation.data.playlistId,
      album: validation.data.album,
      duration: validation.data.duration,
      artists: trackFieldEncode(validation.data.artist),
      genre: trackFieldEncode(validation.data.genre),
      title: validation.data.title,
      fileId: validation.data.fileId,
    },
  });

  return success(track);
};
