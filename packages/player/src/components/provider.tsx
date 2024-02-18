import { useImmer } from "use-immer";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { PlayerContext, StateContext } from "../hooks";
import { PlayerState } from "../model/state";
import { Player } from "../api";

export function Provider(
  props: React.PropsWithChildren<{ initialState?: PlayerState }>
) {
  const [state, dispatch] = useImmer(
    () => props.initialState || new PlayerState()
  );
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const instance = new Player({
      state,
      onChange(nextState) {
        dispatch(draft => {
          if (draft !== nextState) {
            return nextState;
          }
        });
      },
    });

    setPlayer(instance);

    window["player"] = instance;

    return instance.init();
  }, []);

  useLayoutEffect(() => {
    player?.setState(state);
  }, [state, player]);

  return (
    <StateContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <PlayerContext.Provider value={player}>
        {props.children}
      </PlayerContext.Provider>
    </StateContext.Provider>
  );
}
