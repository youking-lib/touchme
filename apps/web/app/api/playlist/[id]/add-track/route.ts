import { NextRequest } from "next/server";
import { invalidBody, notFound, success } from "@/libs/http";
import {
  PlaylistAddTrackPostValidator,
  PlaylistAddTrackPostOutput,
} from "@repo/schema";
import { prisma } from "@/libs/prisma";

import { trackFieldEncode } from "./format";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const validation = PlaylistAddTrackPostValidator.safeParse(body);

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

  const track: PlaylistAddTrackPostOutput = await prisma.playlistTrack.create({
    data: {
      playlistId: validation.data.playlistId,
      album: validation.data.album,
      duration: validation.data.duration,
      artists: validation.data.artists,
      genre: validation.data.genre,
      title: validation.data.title,
      fileId: validation.data.fileId,
      format: validation.data.format,
    },
  });

  return success(track);
};
