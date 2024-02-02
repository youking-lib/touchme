import { PlayerStatus, Playlist, ModelSelector, Track } from ".";
import { PlayerState } from "./state";

export const setDarkMode = (state: PlayerState) =>
  PlayerState.set(state, state => {
    state.darkMode = !state.darkMode;
  });

export const setPlayerTabsOpen = (
  state: PlayerState,
  open = !state.playerTabsOpen
) =>
  PlayerState.set(state, state => {
    state.playerTabsOpen = open;
  });

export const setLocalPlaylists = (state: PlayerState, playlists: Playlist[]) =>
  PlayerState.set(state, draft => {
    draft.localPlaylists = playlists;
  });

export const setOrInitPlayQueue = (
  state: PlayerState,
  playingQueue?: Playlist
) => {
  const playlists = ModelSelector.getPlaylists(state);

  return PlayerState.set(state, draft => {
    if (!playingQueue && playlists.length > 0) {
      playingQueue = playlists[0];
    }

    if (!playingQueue) {
      return;
    }

    draft.playingQueue = playingQueue;
  });
};

export const setOrInitPlayTrack = (state: PlayerState, track?: Track) => {
  return PlayerState.set(state, draft => {
    if (!track && state.playingQueue) {
      track = state.playingQueue.tracks[0];
    }

    if (track && ModelSelector.getTrackInPlayingQueueById(state, track.id)) {
      draft.playingTrack = track;
    }
  });
};

export const setPlayerStatus = (state: PlayerState, status: PlayerStatus) =>
  PlayerState.set(state, draft => {
    draft.playingStatus = status;
  });

export const setPlayerCurrentTime = (state: PlayerState, currentTime: number) =>
  PlayerState.set(state, draft => {
    draft.playingCurrentTime = currentTime;
  });

export const setPlaylistName = (state: PlayerState, id: string, name: string) =>
  PlayerState.set(state, draft => {
    const playlist = ModelSelector.getPlaylistById(draft, id);

    if (playlist) {
      playlist.name = name;
    }
  });
