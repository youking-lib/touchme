import React from "react";
import { Updater } from "use-immer";
import { PlayerState } from "../model/state";
import { Player } from "../api";

export type StateContext = {
  state: PlayerState;
  dispatch: Updater<PlayerState>;
};

export type PlayerContext = Player;

export const StateContext = React.createContext<StateContext | null>(null);
export const PlayerContext = React.createContext<PlayerContext | null>(null);
