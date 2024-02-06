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
    <div className="h-[150px] flex flex-col py-1 px-4">
      <div className="flex-1">
        <div className="flex h-5 items-center space-x-2 text-xs text-muted-foreground">
          <div>FLAC</div>
          <Separator orientation="vertical" />
          <div>874kbps</div>
          <Separator orientation="vertical" />
          <div>16bit</div>
          <Separator orientation="vertical" />
          <div>44.1kHz</div>
        </div>

        <Separator className="mb-4 mt-1" />

        <div className="space-y-2">
          <h4 className="font-medium leading-none">{playTrack?.title || ""}</h4>
          <p className="text-xs text-muted-foreground">
            {artist && <span>@{artist}|</span>}
            {album}
          </p>
        </div>
      </div>

      <PlayingProgress />

      <div className="flex justify-between">
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
      className="my-2"
      max={track?.duration}
      value={[playingCurrentTime]}
    />
  );
}
