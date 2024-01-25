import { PlayerStatus, Playlist, StateSelector, Track } from ".";
import { PlayerState } from "./state";

export const setDarkMode = (state: PlayerState) => {
  return PlayerState.set(state, state => {
    state.darkMode = !state.darkMode;
  });
};

export const setLocalPlaylists = (
  state: PlayerState,
  playlists: Playlist[]
) => {
  let nextState = PlayerState.set(state, draft => {
    draft.localPlaylists = playlists;
  });

  if (!nextState.playQueue) {
    nextState = setOrInitPlayQueue(nextState);
  }
  if (!nextState.playTrack) {
    nextState = setOrInitPlayTrack(nextState);
  }

  return nextState;
};

export const setOrInitPlayQueue = (
  state: PlayerState,
  playQueue?: Playlist
) => {
  return PlayerState.set(state, draft => {
    if (!playQueue && state.localPlaylists.length > 0) {
      playQueue = state.localPlaylists[0];
    }

    if (!playQueue) {
      return;
    }

    draft.playQueue = playQueue;

    if (!playQueue.tracks) {
      return;
    }
  });
};

export const setOrInitPlayTrack = (state: PlayerState, track?: Track) => {
  return PlayerState.set(state, draft => {
    if (!track && state.playQueue) {
      track = state.playQueue.tracks[0];
    }

    if (track && StateSelector.getHasPlayTrack(state, track.id)) {
      draft.playTrack = track;

      return;
    }
  });
};

export const setPlayStatus = (state: PlayerState, status: PlayerStatus) =>
  PlayerState.set(state, draft => {
    draft.playStatus = status;
  });
