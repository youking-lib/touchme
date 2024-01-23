import { Playlist } from ".";
import { PlayerState } from "./state";

export const setDarkMode = (state: PlayerState) => {
  return PlayerState.set(state, state => {
    state.darkMode = !state.darkMode;
  });
};

export const updateLocalPlaylists = (
  state: PlayerState,
  playlists: Playlist[]
) => {
  return PlayerState.set(state, state => {
    state.localPlaylists = playlists;
  });
};
