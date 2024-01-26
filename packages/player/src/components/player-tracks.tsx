import { Icon } from "@repo/ui/icon";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@repo/ui/table";
import { clsx } from "clsx";

import { useSelector, useLazyPlayer } from "../hooks";
import { Playlist, ModelSelector, Track } from "../model";
import { PlayerlistItem } from "./player-list-item";

export function PlayerTracks({ playlist }: { playlist: Playlist }) {
  const tracks = playlist.tracks || [];
  const playTrack = useSelector(ModelSelector.getPlayingTrack);

  return (
    <div className="ui-text-muted-foreground">
      <PlayerlistItem playlist={playlist} />

      <Table className="ui-text-xs ui-table-fixed">
        <colgroup>
          <col width="2" />
          <col width="14" />
          <col width="6" />
        </colgroup>

        <TableCaption className="ui-text-xs">
          {playlist.name}|{tracks.length} Tracks
        </TableCaption>
        <TableBody>
          {tracks.map((track, index) => {
            return (
              <TrackRow
                key={track.id}
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
  active: boolean;
  track: Track;
  index: number;
};

function TrackRow({ track, index, active }: TrackRowProps) {
  const loader = useLazyPlayer();

  return (
    <TableRow className={clsx({ ["ui-text-foreground"]: active })}>
      <TableCell className="">
        {active ? <Icon name="Activity" /> : `${index + 1}.`}
      </TableCell>
      <TableCell
        className={clsx(
          "ui-text-ellipsis ui-text-nowrap ui-overflow-hidden hover:ui-underline ui-cursor-pointer",
          {
            "ui-underline": active,
          }
        )}
        onClick={() => {
          loader(player => {
            if (!active) {
              player.setTrack(track);
            } else {
              player.playPause();
            }
          });
        }}
      >
        {track.title}
      </TableCell>
      <TableCell className="ui-text-right">{track.artist[0]}</TableCell>
    </TableRow>
  );
}