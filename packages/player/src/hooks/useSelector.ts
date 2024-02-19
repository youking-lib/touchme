import { useContext, DependencyList, useMemo } from "react";
import { Updater } from "use-immer";

import { PlayerState } from "../model/state";
import { StateContext } from "./context";

export function useSelector<T>(
  selector: (state: PlayerState, dispatch: Updater<PlayerState>) => T,
  deps: DependencyList = []
): T {
  const ctx = useContext(StateContext)!;

  return useMemo(() => {
    return selector(ctx.state, ctx.dispatch);
  }, [ctx.state, ...deps]);
}
