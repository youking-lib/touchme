export interface Track {
  id: string;
  album: string;
  artist: string[];
  duration: number;
  genre: string[];
  loweredMetas: {
    artist: string[];
    album: string;
    title: string;
    genre: string[];
  };
  path: string;
  playCount: number;
  title: string;
  track: {
    no: number;
    of: number;
  };
  year: number | null;
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
    status: UploadQueueStatus;
  }[];
}

export type UploadQueueStatus = "pending" | "uploading" | "resolve" | "reject";
