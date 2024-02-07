import axios from "axios";
import { fetch } from "../utils";
import { md5 } from "js-md5";
import {
  PlaylistPostOutput,
  HashSignPostOutput,
  HashSignPostInput,
  PlaylistPostInput,
} from "@repo/schema";

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

    const localPlaylist = ModelSelector.getPlaylistById(
      this.api.getState(),
      id
    );
    const taskId = localPlaylist!.id;

    if (!isLocalPlaylist) return;

    const playlist = await fetch<PlaylistPostOutput, PlaylistPostInput>({
      url: "/api/playlist",
      method: "POST",
      data: {
        name: localPlaylist?.name || "",
      },
    });

    this.api.setState(state =>
      ModelMutation.addUploadTask(state, taskId, playlist.id)
    );

    const tracks = localPlaylist!.tracks as FileTrack[];

    await this.uploadFile(tracks[1].file, event => {
      // console.log(`Upload [${(progress*100).toFixed(2)}%]: ${(rate / 1024).toFixed(2)}KB/s`)

      this.api.setState(state =>
        ModelMutation.setUploadTaskItemState(state, taskId, tracks[1].id, {
          status: event.progress === 1 ? "resolve" : "uploading",
          progress: event.progress,
          rate: event.rate,
        })
      );
    });

    this.api.setState(state =>
      ModelMutation.setUploadTaskItemState(state, taskId, tracks[1].id, {
        status: "resolve",
      })
    );
  }

  async uploadFile(
    file: File,
    onProgress: (event: { progress: number; rate: number }) => void
  ) {
    const buffer = await file.arrayBuffer();
    const hash = md5(buffer);

    const hashSignResponse = await fetch<HashSignPostOutput, HashSignPostInput>(
      {
        url: "/api/file/hash-sign",
        method: "POST",
        data: {
          hash,
          filename: file.name,
        },
      }
    );

    if (hashSignResponse.signedUrl) {
      const res = await axios({
        url: hashSignResponse.signedUrl,
        method: "PUT",
        data: file,
        headers: { "Content-Type": file.type },
        onUploadProgress({ progress, rate }) {
          onProgress({
            progress: progress || 0,
            rate: rate || 0, // bytes/s
          });
        },
      });

      if (res.status !== 200) {
        throw new Error("Upload Error: " + res.statusText);
      }
    }

    return {
      hash: hashSignResponse.hash,
      key: hashSignResponse.key,
    };
  }
}
