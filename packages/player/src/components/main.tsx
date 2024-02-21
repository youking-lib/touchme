import React from "react";
import { Card, CardContent } from "@repo/ui";

import { Provider, ProviderProps } from "./provider";
import { PlayerTabs } from "./player-tabs";
import { PlayerControl } from "./player-control";
import { ModelSelector } from "../model";
import { useSelector } from "../hooks";
import { UploadTasks } from "./upload-tasks";
import clsx from "clsx";

export type MainProps = React.PropsWithChildren<
  Pick<ProviderProps, "initialState"> & {
    className?: string;
  }
>;

export function Main({ className, initialState }: MainProps): JSX.Element {
  return (
    <Provider initialState={initialState}>
      <div className={clsx("dark player h-full", className)} data-role="player">
        <Inner />
      </div>

      <UploadTasks />
    </Provider>
  );
}

function Inner() {
  const playerTabsOpen = useSelector(ModelSelector.getPlayerTabsOpen);

  return (
    <Card className="rounded-none">
      <CardContent className="p-0 w-[360px]">
        <div className="py-2">
          <PlayerControl />
        </div>
        {playerTabsOpen && <PlayerTabs />}
      </CardContent>
    </Card>
  );
}
