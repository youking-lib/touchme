import { useContext } from "react";
import { Updater } from "use-immer";

import { PlayerState } from "../model/state";
import { StateContext } from "./context";

export function useSelector<T>(
  selector: (state: PlayerState, dispatch: Updater<PlayerState>) => T
): T {
  const ctx = useContext(StateContext)!;

  return selector(ctx.state, ctx.dispatch);
}
