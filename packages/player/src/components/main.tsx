import React from "react";
import { Card, CardContent } from "@repo/ui";

import { Provider } from "./provider";
import { PlayerTabs } from "./player-tabs";
import { PlayerControl } from "./player-control";
import { ModelSelector } from "../model";
import { useSelector } from "../hooks";
import { UploadTasks } from "./upload-tasks";

export function Main({ children }: React.PropsWithChildren): JSX.Element {
  return (
    <Provider>
      <div className="dark player" data-role="player">
        <Inner />
      </div>

      <UploadTasks />
    </Provider>
  );
}

function Inner() {
  const playerTabsOpen = useSelector(ModelSelector.getPlayerTabsOpen);

  return (
    <Card>
      <CardContent className="p-0 w-[360px]">
        <div className="py-2">
          <PlayerControl />
        </div>
        {playerTabsOpen && <PlayerTabs />}
      </CardContent>
    </Card>
  );
}
