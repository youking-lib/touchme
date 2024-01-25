import { immerable, produce } from "immer";
import { Playlist, Track } from ".";

export class PlayerState {
  [immerable] = true;

  config = {
    DEBUG_MUSIC_SOURCE: "/Welshly%20Arms%20-%20Legendary.flac",
  };

  darkMode = false;

  playlists: Playlist[] = [];
  localPlaylists: Playlist[] = [];

  playQueue: Playlist | null = null;
  playTrack: Track | null = null;

  static set(state: PlayerState, recipe: (draft: PlayerState) => void) {
    return produce(state, draft => {
      recipe(state);
    });
  }
}
