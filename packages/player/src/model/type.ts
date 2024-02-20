import { PlaylistAddTrackPostOutput, PlaylistSchema } from "@repo/schema";

export type Track = HubTrack | LocalFileTrack;

export type HubTrack = PlaylistAddTrackPostOutput;

export interface LocalFileTrack extends PlaylistAddTrackPostOutput {
  localFile: File;
}

export const isLocalFileTrack = (
  track: LocalFileTrack | Track
): track is LocalFileTrack => Boolean((track as LocalFileTrack)["localFile"]);

export type Playlist = LocalPlaylist | HubPlaylist;
export interface LocalPlaylist {
  id: string;
  name: string;
  tracks: LocalFileTrack[];
}

export type HubPlaylist = PlaylistSchema.Get["Output"][number];

export enum PlayerStatus {
  PLAY = "play",
  PAUSE = "pause",
  STOP = "stop",
}

export interface UploadTask {
  localPlaylistId: string;
  targetPlaylistId: string;
  queue: {
    id: string;
    progress: number;
    rate: number;
    status: UploadQueueStatus;
  }[];
}

export type UploadQueueStatus = "pending" | "uploading" | "resolve" | "reject";
