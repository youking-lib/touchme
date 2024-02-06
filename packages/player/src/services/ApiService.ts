import axios from "axios";
import { md5 } from "js-md5";

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

    const res = await axios<Playlist>({
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

    this.uploadFile(tracks[1].file);

    // while (index++ < chunks.length) {

    // }
  }

  async uploadFile(file: File) {
    const buffer = await file.arrayBuffer();
    const hash = md5(buffer);

    // const response = await axios<{
    //   data: { id: string; key: string };
    //   success: boolean;
    // }>(`/api/file/upload`, {
    //   method: "POST",
    //   data: form,
    // });

    const response = await axios<{ data: { signedUrl: string } }>(
      "/api/file/hash-sign",
      {
        method: "POST",
        data: {
          hash,
          filename: file.name,
        },
      }
    );

    const res = await axios(response.data.data.signedUrl, {
      method: "PUT",
      data: file,
      headers: { "Content-Type": file.type },
    });

    if (res.status !== 200) {
      throw new Error("upload error");
    }

    return response.data;
  }
}
