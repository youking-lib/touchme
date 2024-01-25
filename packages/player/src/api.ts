import isFunction from "lodash/isFunction";
import {
  PlayerState,
  PlayerStatus,
  Playlist,
  StateMutation,
  StateSelector,
  Track,
} from "./model";
import { LocalService } from "./services/LocalService";
import { PlayService } from "./services/PlayService";

export type PlayerOptions = {
  state: PlayerState;
  onChange?: (state: PlayerState, prev: PlayerState) => void;
};

export class Player {
  public service = {
    playService: new PlayService(this),
    localService: new LocalService(this),
  };

  constructor(public options: PlayerOptions) {}

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
    const paused = this.service.playService.getAudio().paused;

    if (paused && this.getState().playQueue) {
      return this.play();
    } else {
      return this.pause();
    }
  }

  async play() {
    const track = StateSelector.getPlayTrack(this.getState());

    if (!track) {
      return;
    }

    this.service.playService.setTrack(track);
    await this.service.playService.play();

    this.setState(state =>
      StateMutation.setPlayStatus(state, PlayerStatus.PLAY)
    );
  }

  pause() {
    this.service.playService.pause();

    this.setState(state =>
      StateMutation.setPlayStatus(state, PlayerStatus.PAUSE)
    );
  }

  async next() {
    const nextTrack = StateSelector.getNextPlayTrack(this.getState());

    if (nextTrack) {
      this.setTrack(nextTrack);
    }

    return nextTrack;
  }

  async prev() {
    const prevTrack = StateSelector.getPrevPlayTrack(this.getState());

    if (prevTrack) {
      this.setTrack(prevTrack);
    }

    return prevTrack;
  }

  setTrack(track: Track) {
    if (track !== StateSelector.getPlayTrack(this.getState())) {
      this.setState(state => StateMutation.setOrInitPlayTrack(state, track));
    }

    return this.play();
  }

  getPlayinglist(): Playlist | null {
    return this.getState().localPlaylists[0] || null;
  }
}
