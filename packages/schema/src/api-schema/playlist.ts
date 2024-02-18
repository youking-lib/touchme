import { Playlist, PlaylistTrack, Prisma } from "@prisma/client";
import z, { array, number, object, string } from "zod";

export const PlaylistAddTrackPostValidator = object({
  playlistId: string(),
  album: string(),
  artists: string(),
  duration: number(),
  genre: string(),
  title: string(),
  fileId: string(),
  format: string(),
});

export type PlaylistAddTrackPostInput = z.infer<
  typeof PlaylistAddTrackPostValidator
>;
export type PlaylistAddTrackPostOutput = PlaylistTrack;

export module PlaylistSchema {
  export type Post = {
    Input: z.infer<typeof Validator.PostInput>;
    Output: Playlist;
  };

  export type Get = {
    Input: z.infer<typeof Validator.GetInput>;
    Output: Prisma.PlaylistGetPayload<{
      include: {
        user: true;
        tracks: {
          include: {
            file: {
              select: {
                id: true;
                hash: true;
                key: true;
              };
            };
          };
        };
      };
    }>[];
  };

  export const Validator = {
    PostInput: object({
      name: string(),
    }),

    GetInput: object({
      page: number().default(0),
      pageSize: number().default(10),
      orderBy: string().nullable(),
      order: string().nullable(),
    }),
  };
}
