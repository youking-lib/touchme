import fetch from "axios";
import chunk from "lodash/chunk";

import { Player } from "../api";
import { FileTrack, ModelMutation, ModelSelector, Playlist } from "../model";

export class ApiService {
  constructor(public api: Player) {}

  async updatePlaylistName(id: string, name: string) {
    const isLocalPlaylist = ModelSelector.getIsLocalPlaylist(
      this.api.getState(),
      id
    );

    if (isLocalPlaylist) {
      await this.api.localService.updatePlaylist(id, { name });

      this.api.setState(state =>
        ModelMutation.setPlaylistName(state, id, name)
      );
    }
  }

  async uploadPlaylist(id: string) {
    const isLocalPlaylist = ModelSelector.getIsLocalPlaylist(
      this.api.getState(),
      id
    );

    if (!isLocalPlaylist) return;

    const localPlaylist = ModelSelector.getPlaylistById(
      this.api.getState(),
      id
    );

    const res = await fetch<Playlist>({
      url: "/api/playlist",
      method: "POST",
      data: {
        name: localPlaylist?.name || "",
      },
    });

    this.api.setState(state =>
      ModelMutation.addUploadTask(state, localPlaylist!.id, res.data.id)
    );

    const uploadTask = ModelSelector.getUploadTaskById(
      this.api.getState(),
      localPlaylist!.id
    )!;
    const tracks = localPlaylist!.tracks as FileTrack[];

    this.uploadFile(tracks[0].file);

    // while (index++ < chunks.length) {

    // }
  }

  async uploadFile(file: File) {
    const form = new FormData();

    form.append("file", file);

    const response = await fetch<{
      data: { id: string; key: string };
      success: boolean;
    }>(`/api/file/upload`, {
      method: "POST",
      data: form,
    });

    return response.data;
  }
}
