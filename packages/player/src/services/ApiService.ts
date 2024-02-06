import fetch from "axios";
import { Player } from "../api";
import { ModelMutation, ModelSelector } from "../model";

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

    const playlist = ModelSelector.getPlaylistById(this.api.getState(), id);

    const res = await fetch({
      url: "/api/playlist",
      method: "POST",
      data: {
        name: playlist?.name || "",
      },
    });

    console.log(res.data);
  }
}
