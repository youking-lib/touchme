import { Icon } from "@repo/ui/icon";
import Upload, { UploadProps } from "rc-upload";

import { useSelector, useMutation, useLazyPlayer } from "../hooks";
import { ModelSelector } from "../model";
import { PlayerTracks } from "./player-tracks";

export function PlayerList() {
  const playlists = useSelector(ModelSelector.getPlaylists);

  const isEmpty = playlists.length === 0;

  if (isEmpty) {
    return <UploadLocal />;
  }

  const playlist = playlists[0];

  return (
    <div className="ui-min-h-[200px] ui-pb-2">
      {playlist && <PlayerTracks playlist={playlist} />}
    </div>
  );
}

function UploadLocal() {
  const loader = useLazyPlayer();
  const mutations = useMutation();

  const props: UploadProps = {
    async onBatchStart(files) {
      const player = await loader();
      const tracks = await player.localService.importFiles(
        files.map(item => item.file)
      );

      await player.localService.createPlaylist({
        name: "Unknown Playlist",
        tracks,
      });

      const playlists = await player.localService.getPlaylists();

      mutations.setLocalPlaylists(playlists);
    },
    async beforeUpload() {
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
