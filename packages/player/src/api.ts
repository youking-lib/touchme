import isFunction from "lodash/isFunction";
import {
  PlayerState,
  PlayerStatus,
  Playlist,
  ModelMutation,
  ModelSelector,
  Track,
} from "./model";
import { LocalService } from "./services/LocalService";
import { PlayService } from "./services/PlayService";
import { ModelHelpers } from "./model-helpers";

export type PlayerOptions = {
  state: PlayerState;
  onChange?: (state: PlayerState, prev: PlayerState) => void;
};

export class Player {
  playService = new PlayService(this);
  localService = new LocalService(this);

  constructor(public options: PlayerOptions) {}

  init() {
    const destoryCallbacks = [
      ModelHelpers.syncStateByAudioPlayerEvent(this),
      ModelHelpers.syncStateByLocalService(this),
    ];

    return () => {
      destoryCallbacks.forEach(item => {
        if (isFunction(item)) {
          item();
        }
      });
    };
  }

  getState() {
    return this.options.state;
  }

  setState(state: PlayerState | ((state: PlayerState) => PlayerState)) {
    const recipe = isFunction(state) ? state : () => state;
    const nextState = recipe(this.getState());

    if (nextState !== this.options.state) {
      const prevState = this.options.state;

      this.options.state = nextState;
      this.options.onChange?.(nextState, prevState);
    }
  }

  playPause() {
    const paused = this.playService.getAudio().paused;

    if (paused && this.getState().playingQueue) {
      return this.play();
    } else {
      return this.pause();
    }
  }

  async play() {
    const track = ModelSelector.getPlayingTrack(this.getState());

    if (!track) {
      return;
    }

    this.setTrack(track);
    await this.playService.play();

    this.setState(state =>
      ModelMutation.setPlayerStatus(state, PlayerStatus.PLAY)
    );
  }

  pause() {
    this.playService.pause();

    this.setState(state =>
      ModelMutation.setPlayerStatus(state, PlayerStatus.PAUSE)
    );
  }

  async next() {
    const nextTrack = ModelSelector.getNextPlayTrack(this.getState());

    if (nextTrack) {
      this.setTrack(nextTrack);
      this.play();
    }

    return nextTrack;
  }

  async prev() {
    const prevTrack = ModelSelector.getPrevPlayTrack(this.getState());

    if (prevTrack) {
      this.setTrack(prevTrack);
      this.play();
    }

    return prevTrack;
  }

  setTrack(track: Track) {
    if (track !== ModelSelector.getPlayingTrack(this.getState())) {
      this.setState(state => ModelMutation.setOrInitPlayTrack(state, track));
    }

    this.playService.setTrack(track);
  }

  setCurrentTime(currentTime: number) {
    const track = ModelSelector.getPlayingTrack(this.getState());

    if (track) {
      this.setState(state =>
        ModelMutation.setPlayerCurrentTime(state, currentTime)
      );
      this.playService.setTrack(track);
      this.playService.setCurrentTime(currentTime);
    }
  }
}
