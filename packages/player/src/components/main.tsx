import React from "react";
import { Card, CardContent } from "@repo/ui";

import { Provider } from "./provider";
import { PlayerTabs } from "./player-tabs";
import { PlayerControl } from "./player-control";
import { ModelSelector } from "../model";
import { useSelector } from "../hooks";
import { UploadTask } from "./upload-task";

export function Main({ children }: React.PropsWithChildren): JSX.Element {
  return (
    <Provider>
      <Inner />

      <UploadTask />
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
