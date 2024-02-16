import { Playlist, PlaylistTrack } from "@prisma/client";
import z, { array, number, object, string } from "zod";

export const PlaylistPostValidator = object({
  name: string(),
});

export type PlaylistPostInput = z.infer<typeof PlaylistPostValidator>;
export type PlaylistPostOutput = Playlist;

export const PlaylistAddTrackPostValidator = object({
  playlistId: string(),
  album: string(),
  artist: array(string()),
  duration: number(),
  genre: array(string()).default([]),
  title: string(),
  fileId: string(),
  format: string(),
});

export type PlaylistAddTrackPostInput = z.infer<
  typeof PlaylistAddTrackPostValidator
>;
export type PlaylistAddTrackPostOutput = PlaylistTrack;
