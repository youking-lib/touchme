import { Upload, UploadProps } from "antd";
import { Icon } from "@repo/ui/icon";

import { useService } from "../hooks/useService";
import { useMutation, useSelector } from "../hooks";
import { Playlist } from "../model";
import { useEffect } from "react";

export function PlayerLists() {
  const localPlaylists = useSelector(state => state.localPlaylists);
  const mutations = useMutation();
  const service = useService();

  useEffect(() => {
    init();

    async function init() {
      const playlists = await service.localService.getPlaylists();
      mutations.updateLocalPlaylists(playlists);
    }
  }, []);

  return (
    <div className="ui-bg-white ui-p-2">
      player list
      {localPlaylists.map(item => (
        <PlayerList key={item.id} playlist={item} />
      ))}
      <UploadLocal />
      <div className="" data-role="drop-music"></div>
    </div>
  );
}

export function PlayerList({ playlist }: { playlist: Playlist }) {
  return (
    <div className="ui-flex">
      <div>{playlist.name}</div>
    </div>
  );
}

function UploadLocal() {
  const service = useService();
  const mutations = useMutation();

  const props: UploadProps = {
    async beforeUpload(_, files) {
      const tracks = await service.localService.importFiles(Array.from(files));

      await service.localService.createPlaylist({
        name: "Unknown Playlist",
        tracks,
      });

      const playlists = await service.localService.getPlaylists();

      mutations.updateLocalPlaylists(playlists);

      return false;
    },
    showUploadList: false,
    multiple: true,
  };

  return (
    <Upload.Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <Icon name="Upload" />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Upload.Dragger>
  );
}
