export interface Track {
  id: string;
  album: string;
  artist: string[];
  disk: {
    no: number;
    of: number;
  };
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
