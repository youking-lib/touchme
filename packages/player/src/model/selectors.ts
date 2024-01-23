import { PlayerState } from "./state";

export const getDarkMode = (state: PlayerState) => state.darkMode;
export const getPlaylists = (state: PlayerState) => state.playlists;
export const getPlayQueue = (state: PlayerState) => state.playQueue;
