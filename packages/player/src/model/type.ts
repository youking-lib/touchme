export interface Track {
  id: string;
  album: string;
  artist: string[];
  duration: number;
  genre: string[];
  path: string;
  title: string;
  format: string;
}

export interface FileTrack extends Track {
  file: File;
}

export const isFileTrack = (track: FileTrack | Track): track is FileTrack =>
  Boolean((track as FileTrack)["file"]);

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

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
