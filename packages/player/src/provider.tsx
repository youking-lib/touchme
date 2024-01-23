import { useImmer } from "use-immer";
import React, { useMemo } from "react";
import { ApiContext, StateContext } from "./hooks";
import { PlayerState } from "./model/state";
import { PlayerApi } from "./PlayerApi";

export function Provider(
  props: React.PropsWithChildren<{ initialState?: PlayerState }>
) {
  const [state, dispatch] = useImmer(
    () => props.initialState || new PlayerState()
  );
  const api = useMemo(() => {
    return new PlayerApi({
      state,
      onChange(nextState) {
        dispatch(draft => {
          if (draft !== nextState) {
            return nextState;
          }
        });
      },
    });
  }, []);

  window["playerApi"] = api;
  api.setState(state);

  return (
    <StateContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>
    </StateContext.Provider>
  );
}
