import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import {
  Icon,
  ToggleGroup,
  ToggleGroupItem,
  Toggle,
  Slider,
  Separator,
} from "@repo/ui";
import { animated, useSpring } from "@react-spring/web";
import {
  IAudioMetadata,
  fetchFromUrl,
  parseBlob,
} from "music-metadata-browser";

import { useLazyPlayer, useMutation, useSelector } from "../hooks";
import { ModelSelector, PlayerStatus, isLocalFileTrack } from "../model";

type PlayerControlProps = {};

export function PlayerControl({}: PlayerControlProps) {
  const playTrack = useSelector(ModelSelector.getPlayingTrack);
  const playStatus = useSelector(ModelSelector.getPlayingStatus);
  const playerTabsOpen = useSelector(ModelSelector.getPlayerTabsOpen);

  const wrapperElStyle = useSpring({
    height: playTrack ? 150 : 70,
  });

  const mutations = useMutation();
  const loader = useLazyPlayer();

  return (
    <animated.div
      className="h-[150px] flex flex-col justify-center py-1 px-4"
      style={wrapperElStyle}
    >
      <PlayingTrackMeta />
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
    </animated.div>
  );
}

function PlayingProgress() {
  const track = useSelector(ModelSelector.getPlayingTrack);
  const playingCurrentTime = useSelector(ModelSelector.getPlayingCurrentTime);

  const ref = useRef<React.ElementRef<typeof Slider>>(null);

  return (
    <Slider
      ref={ref}
      className={clsx("my-2", {
        hidden: !track,
      })}
      max={track?.duration}
      value={[playingCurrentTime]}
    />
  );
}

function PlayingTrackMeta() {
  const playTrack = useSelector(ModelSelector.getPlayingTrack);
  const artist = playTrack?.artists;
  const album = playTrack?.album;
  const loadApi = useLazyPlayer();

  const [trackFormat, setTrackFormat] = useState<
    IAudioMetadata["format"] | null
  >(null);

  useEffect(() => {
    parseFormat();

    async function parseFormat() {
      if (!playTrack) {
        return;
      }

      if (isLocalFileTrack(playTrack)) {
        const { format } = await parseBlob(playTrack.localFile);
        setTrackFormat(format);
      } else {
        // const api = await loadApi();
        // const url = await api.apiService.parseTrackUri(playTrack);
        // const { format } = await fetchFromUrl(url);
        // setTrackFormat(format);
      }
    }
  }, [playTrack]);

  return (
    <div
      className={clsx("flex-1", {
        hidden: !playTrack,
      })}
    >
      <div className="flex h-5 items-center space-x-2 text-xs text-muted-foreground">
        {trackFormat?.codec && (
          <>
            <div>{trackFormat.codec}</div>
          </>
        )}
        {trackFormat?.bitrate && (
          <>
            <Separator orientation="vertical" />
            <div>{(trackFormat.bitrate / 1000).toFixed(0)}kbps</div>
          </>
        )}
        {trackFormat?.bitsPerSample && (
          <>
            <Separator orientation="vertical" />
            <div>{trackFormat.bitsPerSample}bit</div>
          </>
        )}
        {trackFormat?.sampleRate && (
          <>
            <Separator orientation="vertical" />
            <div>{trackFormat.sampleRate / 1000}kHz</div>
          </>
        )}
        {trackFormat?.lossless && (
          <>
            <Separator orientation="vertical" />
            <div>lossless</div>
          </>
        )}
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
  );
}
