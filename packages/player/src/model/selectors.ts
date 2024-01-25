import { Track } from ".";
import { PlayerState } from "./state";

export const getDarkMode = (state: PlayerState) => state.darkMode;
export const getPlaylists = (state: PlayerState) => state.playlists;
export const getPlayQueue = (state: PlayerState) => state.playQueue;
export const getHasPlayTrack = (state: PlayerState, trackId: string) => {
  const finded = state.playQueue?.tracks.find(item => item.id === trackId);
  return Boolean(finded);
};
