import { Player } from "../api";
import { ModelMutation, ModelSelector } from "../model";

export async function syncStateByLocalService(api: Player) {
  const [playlists, playingState] = await Promise.all([
    api.localService.getPlaylists(),
    api.localService.getPlayingState(),
  ]);

  api.setState(state => ModelMutation.setLocalPlaylists(state, playlists));

  const nextState = api.getState();
  const defaultQueue =
    playingState.playingQueueId &&
    ModelSelector.getPlaylistById(api.getState(), playingState.playingQueueId);
  const defaultTrack =
    playingState.playingTrackId &&
    defaultQueue &&
    defaultQueue.tracks.find(item => item.id === playingState.playingTrackId);

  if (!nextState.playingQueue) {
    api.setState(state =>
      ModelMutation.setOrInitPlayQueue(state, defaultQueue || undefined)
    );
  }

  if (!nextState.playingTrack) {
    api.setState(state =>
      ModelMutation.setOrInitPlayTrack(state, defaultTrack || undefined)
    );
  }

  if (
    nextState.playingTrack?.id &&
    nextState.playingTrack?.id === playingState.playingTrackId
  ) {
    api.setCurrentTime(playingState.playingCurrentTime || 0);
  }
}
