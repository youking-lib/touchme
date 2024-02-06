import { Icon } from "@repo/ui";
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
    <div className="min-h-[200px] pb-2">
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

      await player.localService.importFiles(files.map(item => item.file));

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
      className="min-h-[200px] rounded-xl border border-dashed flex items-center justify-center flex-col space-y-4 text-muted-foreground"
      {...props}
    >
      <Icon name="Upload" size={24} />

      <p className="text-xs">Drag local music files to this area</p>
    </Upload>
  );
}
