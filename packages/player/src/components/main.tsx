import React, { useState } from "react";
import { Card, CardContent } from "@repo/ui/card";

import { Provider } from "./provider";
import { PlayerTabs } from "./player-tabs";
import { PlayerControl } from "./player-control";
import { ModelSelector } from "../model";
import { useSelector } from "../hooks";

export function Main({ children }: React.PropsWithChildren): JSX.Element {
  return (
    <Provider>
      <Inner />
    </Provider>
  );
}

function Inner() {
  const playerTabsOpen = useSelector(ModelSelector.getPlayerTabsOpen);

  return (
    <Card>
      <CardContent className="ui-p-0 ui-w-[360px]">
        <div className="ui-pb-2">
          <PlayerControl />
        </div>
        {playerTabsOpen && <PlayerTabs />}
      </CardContent>
    </Card>
  );
}
