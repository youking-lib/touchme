import {
  Icon,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@repo/ui";
import { clsx } from "clsx";

import { useSelector, useLazyPlayer } from "../hooks";
import { Playlist, ModelSelector, Track, ModelMutation } from "../model";
import { PlayerlistItem, getTitle } from "./player-list-item";

export function PlayerTracks({ playlist }: { playlist: Playlist }) {
  const tracks = playlist.tracks || [];
  const playTrack = useSelector(ModelSelector.getPlayingTrack);

  return (
    <div className="text-muted-foreground">
      <PlayerlistItem
        id={playlist.id}
        title={playlist.name}
        tracksCount={playlist.tracks.length}
      />

      <Table className="text-xs table-fixed">
        <colgroup>
          <col width="2" />
          <col width="14" />
          <col width="6" />
        </colgroup>

        <TableCaption className="text-xs">
          {getTitle(playlist.name)}|{tracks.length} Tracks
        </TableCaption>

        <TableBody>
          {tracks.map((track, index) => {
            return (
              <TrackRow
                key={track.id}
                playlist={playlist}
                track={track}
                index={index}
                active={playTrack?.id === track.id}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

type TrackRowProps = {
  playlist: Playlist;
  active: boolean;
  track: Track;
  index: number;
};

function TrackRow({ track, index, active, playlist }: TrackRowProps) {
  const loader = useLazyPlayer();

  return (
    <TableRow className={clsx({ ["text-foreground"]: active })}>
      <TableCell className="">
        {active ? <Icon name="Activity" /> : `${index + 1}.`}
      </TableCell>
      <TableCell
        className={clsx(
          "text-ellipsis text-nowrap overflow-hidden hover:underline cursor-pointer",
          {
            underline: active,
          }
        )}
        onClick={() => {
          loader(player => {
            if (!active) {
              player.setState(state =>
                ModelMutation.setOrInitPlayQueue(state, playlist)
              );
              player.play(track);
            } else {
              player.playPause();
            }
          });
        }}
      >
        {track.title}
      </TableCell>
      <TableCell className="text-right text-ellipsis text-nowrap overflow-hidden">
        {track.artists}
      </TableCell>
    </TableRow>
  );
}
