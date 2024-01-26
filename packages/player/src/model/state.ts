import { immerable, produce } from "immer";
import { PlayerStatus, Playlist, Track } from ".";

export class PlayerState {
  [immerable] = true;

  config = {
    DEBUG_MUSIC_SOURCE: "/Welshly%20Arms%20-%20Legendary.flac",
  };

  darkMode = false;

  playlists: Playlist[] = [];
  localPlaylists: Playlist[] = [];

  playingQueue: Playlist | null = null;
  playingTrack: Track | null = null;
  playingStatus: PlayerStatus = PlayerStatus.STOP;
  playingCurrentTime: number = 0;

  playerTabsOpen = true;

  static set(state: PlayerState, recipe: (draft: PlayerState) => void) {
    const nextState = produce(state, draft => {
      recipe(draft);
    });

    return nextState;
  }
}
