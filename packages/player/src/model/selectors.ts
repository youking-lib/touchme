import { UploadTask } from ".";
import { PlayerState } from "./state";

export const getDarkMode = (state: PlayerState) => state.darkMode;
export const getPlayerTabsOpen = (state: PlayerState) => state.playerTabsOpen;
export const getPlaylists = (state: PlayerState) => [
  ...state.subPlaylists,
  ...state.localPlaylists,
];
export const getHubViewState = (state: PlayerState) => state.hubViewState;

export const getPlayingQueue = (state: PlayerState) => state.playingQueue;
export const getPlayingTrack = (state: PlayerState) => state.playingTrack;
export const getPlayingStatus = (state: PlayerState) => state.playingStatus;
export const getPlayingCurrentTime = (state: PlayerState) =>
  state.playingCurrentTime;

export const getUploadTasks = (state: PlayerState) => state.uploadTasks;

export const getIsLocalPlaylist = (state: PlayerState, id: string) => {
  return Boolean(state.localPlaylists.find(item => item.id === id));
};

export const getTrackInPlayingQueueById = (
  state: PlayerState,
  trackId: string
) => {
  const finded = state.playingQueue?.tracks.find(item => item.id === trackId);
  return Boolean(finded);
};
export const getPlaylistById = (state: PlayerState, id: string) => {
  return getPlaylists(state).find(item => item.id === id);
};

export const getUploadTaskById = (state: PlayerState, id: string) =>
  state.uploadTasks.find(item => item.localPlaylistId === id);

export const getUploadTaskItemByStatus = (
  state: PlayerState,
  taskId: string,
  status: UploadTask["queue"][number]["status"]
) => {
  const queue = getUploadTaskById(state, taskId)?.queue || [];
  return queue.filter(item => item.status === status);
};

export const getUploadQueueItemById = (
  state: PlayerState,
  taskId: string,
  queueItemId: string
) => {
  const task = getUploadTaskById(state, taskId);
  return task && task.queue.find(item => item.id === queueItemId);
};

export const getPlaylistTrackById = (
  state: PlayerState,
  playlistId: string,
  trackId: string
) => {
  const playlist = getPlaylistById(state, playlistId);

  return playlist?.tracks.find(item => item.id === trackId);
};

export const getNextPlayTrack = (state: PlayerState) => {
  const playQueue = getPlayingQueue(state);
  const playTrack = getPlayingTrack(state);

  if (playTrack && playQueue) {
    const index = playQueue.tracks.findIndex(item => item.id === playTrack.id);
    const nextIndex = (index + 1) % playQueue.tracks.length;

    return playQueue.tracks[nextIndex] || null;
  }

  return null;
};
export const getPrevPlayTrack = (state: PlayerState) => {
  const playQueue = getPlayingQueue(state);
  const playTrack = getPlayingTrack(state);

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
