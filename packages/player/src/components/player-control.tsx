import { Icon } from "@repo/ui/icon";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/toggle-group";
import { Toggle } from "@repo/ui/toggle";

import { Progress } from "@repo/ui/progress";
import { Separator } from "@repo/ui/separator";

type PlayerControlProps = {
  onMenuBtnClick?: () => void;
};

export function PlayerControl({ onMenuBtnClick }: PlayerControlProps) {
  return (
    <div className="ui-flex ui-flex-col ui-py-1 ui-px-4">
      <div>
        <div className="ui-flex ui-h-5 ui-items-center ui-space-x-2 ui-text-xs ui-text-muted-foreground">
          <div>FLAC</div>
          <Separator orientation="vertical" />
          <div>874kbps</div>
          <Separator orientation="vertical" />
          <div>16bit</div>
          <Separator orientation="vertical" />
          <div>44.1kHz</div>
        </div>

        <Separator className="ui-mb-4 ui-mt-1" />

        <div className="ui-space-y-2">
          <h4 className="ui-font-medium ui-leading-none">有没有人告诉你</h4>
          <p className="ui-text-xs ui-text-muted-foreground">
            <span>@陈楚生</span>|原来我一直都不孤单
          </p>
        </div>
      </div>

      <Progress className="ui-my-2" value={33} />

      <div className="flex ui-justify-between">
        <Toggle onClick={onMenuBtnClick}>
          <Icon name="Menu" />
        </Toggle>

        <ToggleGroup type="single">
          <ToggleGroupItem value="SkipBack">
            <Icon name="SkipBack" />
          </ToggleGroupItem>
          <ToggleGroupItem value="Play">
            <Icon name="Play" />
          </ToggleGroupItem>
          <ToggleGroupItem value="SkipForward">
            <Icon name="SkipForward" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Toggle style={{ visibility: "hidden" }}>
          <Icon name="Menu" />
        </Toggle>
      </div>
    </div>
  );
}
