import { Player } from "../api";
import { ModelMutation, ModelSelector } from "../model";

export function syncStateByAudioPlayerEvent(api: Player) {
  const audio = api.playService.getAudio();

  const onTimeUpdate = () => {
    const currentTime = api.playService.getCurrentTime();

    api.setState(state =>
      ModelMutation.setPlayerCurrentTime(state, currentTime)
    );

    const playingQueue = ModelSelector.getPlayingQueue(api.getState());
    const playingTrack = ModelSelector.getPlayingTrack(api.getState());
    const playingCurrentTime = ModelSelector.getPlayingCurrentTime(
      api.getState()
    );

    api.localService.setPlayingState({
      playingCurrentTime,
      playingQueueId: playingQueue?.id,
      playingTrackId: playingTrack?.id,
    });
  };

  const onEnd = () => {
    api.next();
  };

  audio.addEventListener("timeupdate", onTimeUpdate);
  audio.addEventListener("ended", onEnd);

  return () => {
    audio.removeEventListener("timeupdate", onTimeUpdate);
    audio.removeEventListener("ended", onEnd);
  };
}
