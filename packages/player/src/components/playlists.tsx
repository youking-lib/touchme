import { Icon } from "@repo/ui";
import Upload, { UploadProps } from "rc-upload";

import { ModelSelector, Playlist } from "../model";
import { useSelector, useMutation, useLazyPlayer } from "../hooks";
import { PlaylistItem, PlaylistItemProps } from "./playlist-item";

export function UserPlaylists() {
  const playlists = useSelector(ModelSelector.getPlaylists);
  const isEmpty = playlists.length === 0;

  if (isEmpty) {
    return <UploadLocal />;
  }

  return <Playlists playlists={playlists} defaultTrackHeight={500} />;
}

export function HubPlaylists() {
  const playlists = useSelector(
    state => ModelSelector.getHubViewState(state).playlists
  );

  return <Playlists playlists={playlists} />;
}

export function Playlists({
  playlists,
  ...playlistItemProps
}: { playlists: Playlist[] } & Pick<PlaylistItemProps, "defaultTrackHeight">) {
  return (
    <div role="playlists">
      {playlists.map(item => {
        return (
          <PlaylistItem key={item.id} playlist={item} {...playlistItemProps} />
        );
      })}
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
