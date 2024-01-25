import { Track } from ".";
import { PlayerState } from "./state";

export const getDarkMode = (state: PlayerState) => state.darkMode;
export const getPlaylists = (state: PlayerState) => state.playlists;
export const getPlayQueue = (state: PlayerState) => state.playQueue;
export const getPlayTrack = (state: PlayerState) => state.playTrack;
export const getPlayStatus = (state: PlayerState) => state.playStatus;

export const getHasPlayTrack = (state: PlayerState, trackId: string) => {
  const finded = state.playQueue?.tracks.find(item => item.id === trackId);
  return Boolean(finded);
};

export const getNextPlayTrack = (state: PlayerState) => {
  const playQueue = getPlayQueue(state);
  const playTrack = getPlayTrack(state);

  if (playTrack && playQueue) {
    const index = playQueue.tracks.findIndex(item => item.id === playTrack.id);
    const nextIndex = (index + 1) % playQueue.tracks.length;

    return playQueue.tracks[nextIndex] || null;
  }

  return null;
};
export const getPrevPlayTrack = (state: PlayerState) => {
  const playQueue = getPlayQueue(state);
  const playTrack = getPlayTrack(state);

  if (playTrack && playQueue) {
    const index = playQueue.tracks.findIndex(item => item.id === playTrack.id);
    let prevIndex = index - 1;

    if (prevIndex < 0) {
      prevIndex = playQueue.tracks.length - 1;
    }

    return playQueue.tracks[prevIndex] || null;
  }

  return null;
};
