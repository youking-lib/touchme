import React, { useState } from "react";
import { Provider } from "./provider";
import { PlayerTabs } from "./player-tabs";
import { PlayerControl } from "./player-control";
import { Card, CardContent } from "@repo/ui/card";

export function Main({ children }: React.PropsWithChildren): JSX.Element {
  const [tabsOpen, setTabsOpen] = useState(true);

  return (
    <Provider>
      <Card>
        <CardContent className="ui-p-0 ui-w-[360px]">
          <div className="ui-pb-2">
            <PlayerControl
              onMenuBtnClick={() => setTabsOpen(value => !value)}
            />
          </div>
          {tabsOpen && <PlayerTabs />}
        </CardContent>
      </Card>
    </Provider>
  );
}
