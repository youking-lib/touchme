import { PlayerState } from "./model/state";
import { LocalService } from "./services/LocalService";
import { PlayService } from "./services/PlayService";

export type PlayerOptions = {
  state: PlayerState;
  onChange?: (state: PlayerState, prev: PlayerState) => void;
};

export class PlayerApi {
  public service = {
    playService: new PlayService(this),
    localService: new LocalService(this),
  };

  constructor(public options: PlayerOptions) {}

  getState() {
    return this.options.state;
  }

  setState(state: PlayerState) {
    if (state !== this.options.state) {
      const prevState = this.options.state;

      this.options.state = state;
      this.options.onChange?.(state, prevState);
    }
  }
}
