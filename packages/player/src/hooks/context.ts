import React from "react";
import { Updater } from "use-immer";
import { PlayerState } from "../model/state";
import { PlayerApi } from "../PlayerApi";

export type StateContext = {
  state: PlayerState;
  dispatch: Updater<PlayerState>;
};

export type ApiContext = PlayerApi;

export const StateContext = React.createContext<StateContext | null>(null);
export const ApiContext = React.createContext<ApiContext | null>(null);
