import { useRef } from "react";
import {
  Icon,
  ToggleGroup,
  ToggleGroupItem,
  Toggle,
  Slider,
  Separator,
} from "@repo/ui";

import { useLazyPlayer, useMutation, useSelector } from "../hooks";
import { ModelSelector, PlayerStatus } from "../model";

type PlayerControlProps = {};

export function PlayerControl({}: PlayerControlProps) {
  const playTrack = useSelector(ModelSelector.getPlayingTrack);
  const playStatus = useSelector(ModelSelector.getPlayingStatus);
  const playerTabsOpen = useSelector(ModelSelector.getPlayerTabsOpen);

  const mutations = useMutation();
  const loader = useLazyPlayer();

  const artist = playTrack?.artist[0];
  const album = playTrack?.album;

  return (
    <div className="ui-h-[150px] ui-flex ui-flex-col ui-py-1 ui-px-4">
      <div className="ui-flex-1">
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

      <PlayingProgress />

      <div className="ui-flex ui-justify-between">
        <Toggle
          data-state={playerTabsOpen ? "on" : "off"}
          onClick={() => {
            mutations.setPlayerTabsOpen();
          }}
        >
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

function PlayingProgress() {
  const track = useSelector(ModelSelector.getPlayingTrack);
  const playingCurrentTime = useSelector(ModelSelector.getPlayingCurrentTime);

  const ref = useRef<React.ElementRef<typeof Slider>>(null);

  return (
    <Slider
      ref={ref}
      className="ui-my-2"
      max={track?.duration}
      value={[playingCurrentTime]}
    />
  );
}
