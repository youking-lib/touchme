import { Icon } from "@repo/ui/icon";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/toggle-group";
import { Toggle } from "@repo/ui/toggle";
import { Progress } from "@repo/ui/progress";
import { Separator } from "@repo/ui/separator";

import { useLazyPlayer, useSelector } from "../hooks";
import { StateSelector, PlayerStatus } from "../model";

type PlayerControlProps = {
  onMenuBtnClick?: () => void;
};

export function PlayerControl({ onMenuBtnClick }: PlayerControlProps) {
  const playStatus = useSelector(StateSelector.getPlayStatus);
  const playTrack = useSelector(StateSelector.getPlayTrack);
  const loader = useLazyPlayer();

  const artist = playTrack?.artist[0];
  const album = playTrack?.album;

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
          <h4 className="ui-font-medium ui-leading-none">
            {playTrack?.title || ""}
          </h4>
          <p className="ui-text-xs ui-text-muted-foreground">
            {artist && <span>@{artist}|</span>}
            {album}
          </p>
        </div>
      </div>

      <Progress className="ui-my-2" value={33} />

      <div className="flex ui-justify-between">
        <Toggle onClick={onMenuBtnClick}>
          <Icon name="Menu" />
        </Toggle>

        <ToggleGroup type="single">
          <ToggleGroupItem
            data-state="off"
            value="SkipBack"
            onClick={() => {
              loader(player => {
                player.prev();
              });
            }}
          >
            <Icon name="SkipBack" />
          </ToggleGroupItem>
          <ToggleGroupItem
            data-state="off"
            value="Play"
            onClick={() => {
              loader(player => {
                player.playPause();
              });
            }}
          >
            {playStatus === PlayerStatus.PAUSE && <Icon name="Play" />}
            {playStatus === PlayerStatus.STOP && <Icon name="Play" />}
            {playStatus === PlayerStatus.PLAY && <Icon name="Pause" />}
          </ToggleGroupItem>
          <ToggleGroupItem
            data-state="off"
            value="SkipForward"
            onClick={() => {
              loader(player => {
                player.next();
              });
            }}
          >
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
