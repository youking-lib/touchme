import { immerable, produce } from "immer";
import {
  HubPlaylist,
  LocalPlaylist,
  PlayerStatus,
  Playlist,
  Track,
  UploadTask,
} from ".";

export class PlayerState {
  [immerable] = true;

  config = {
    DEBUG_MUSIC_SOURCE: "/Welshly%20Arms%20-%20Legendary.flac",
  };

  darkMode = false;

  subPlaylists: HubPlaylist[] = [];
  localPlaylists: LocalPlaylist[] = [];

  hubViewState = {
    playlists: [] as HubPlaylist[],
    initialzie: false,
  };

  playingQueue: Playlist | null = null;
  playingTrack: Track | null = null;
  playingStatus: PlayerStatus = PlayerStatus.STOP;
  playingCurrentTime: number = 0;

  playerTabsOpen = true;

  uploadTasks: UploadTask[] = [];

  static set(state: PlayerState, recipe: (draft: PlayerState) => void) {
    const nextState = produce(state, draft => {
      recipe(draft);
    });

    return nextState;
  }
}
