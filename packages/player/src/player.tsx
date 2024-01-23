"use client";

import * as React from "react";
import { Provider } from "./provider";
import { PlayerLists } from "./components/player-lists";

export function Player({ children }: React.PropsWithChildren): JSX.Element {
  return (
    <Provider>
      <PlayerLists />
    </Provider>
  );
}
