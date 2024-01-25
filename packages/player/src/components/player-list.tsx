import { useEffect, useState } from "react";
import { Icon } from "@repo/ui/icon";
import Upload, { UploadProps } from "rc-upload";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@repo/ui/table";

import { useSelector, useMutation, useLazyPlayer } from "../hooks";
import { Playlist } from "../model";

export function PlayerList() {
  const localPlaylists = useSelector(state => state.localPlaylists);
  const mutations = useMutation();
  const loader = useLazyPlayer();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loader(async player => {
      const playlists = await player.service.localService.getPlaylists();

      setLoading(false);
      mutations.setLocalPlaylists(playlists);
    });
  }, []);

  const isEmpty = !loading && localPlaylists.length === 0;

  if (isEmpty) {
    return <UploadLocal />;
  }

  const playlist = localPlaylists[0];

  return (
    <div className="ui-min-h-[200px] ui-pb-2">
      {playlist && <Tracks playlist={playlist} />}
    </div>
  );
}

export function Tracks({ playlist }: { playlist: Playlist }) {
  const tracks = playlist.tracks || [];

  return (
    <div className="ui-text-muted-foreground">
      <Table className="ui-text-xs ui-table-fixed">
        <colgroup>
          <col width="2" />
          <col width="16" />
          <col width="4" />
        </colgroup>

        <TableCaption className="ui-text-xs">
          {playlist.name}|{tracks.length} Tracks
        </TableCaption>
        <TableBody>
          <TableRow className="ui-text-foreground">
            <TableCell>
              <Icon name="Activity" />
            </TableCell>
            <TableCell>有没有人告诉你</TableCell>
            <TableCell className="ui-text-right">陈楚生</TableCell>
          </TableRow>

          {tracks.map((track, index) => {
            return (
              <TableRow key={track.title}>
                <TableCell className="">{index + 1}.</TableCell>
                <TableCell>{track.title}</TableCell>
                <TableCell className="ui-text-right">
                  {track.artist[0]}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function UploadLocal() {
  const loader = useLazyPlayer();
  const mutations = useMutation();

  const props: UploadProps = {
    async onBatchStart(files) {
      const player = await loader();
      const tracks = await player.service.localService.importFiles(
        files.map(item => item.file)
      );

      await player.service.localService.createPlaylist({
        name: "Unknown Playlist",
        tracks,
      });

      const playlists = await player.service.localService.getPlaylists();

      mutations.setLocalPlaylists(playlists);
    },
    async beforeUpload(_, files) {
      return false;
    },
    multiple: true,
  };

  return (
    <Upload
      className="ui-min-h-[200px] ui-rounded-xl ui-border ui-border-dashed ui-flex ui-items-center ui-justify-center ui-flex-col ui-space-y-4 ui-text-muted-foreground"
      {...props}
    >
      <Icon name="Upload" size={24} />

      <p className="ui-text-xs">Drag local music files to this area</p>
    </Upload>
  );
}
