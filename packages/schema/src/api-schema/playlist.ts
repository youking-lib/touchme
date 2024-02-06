import { Playlist, PlaylistTrack } from "@prisma/client";
import { array, number, object, string } from "zod";

export const PlaylistPostValidator = object({
  name: string(),
});

export type PlaylistPostInput = typeof PlaylistPostValidator;
export type PlaylistPostOutput = Playlist;

export const PlaylistAddTrackPostValidator = object({
  playlistId: string(),
  album: string(),
  artist: array(string()),
  duration: number(),
  genre: array(string()).default([]),
  title: string(),
  fileId: string(),
});

export type PlaylistAddTrackPostInput = typeof PlaylistAddTrackPostValidator;
export type PlaylistAddTrackPostOutput = PlaylistTrack;
