import { useEffect } from "react";
import { Icon } from "@repo/ui";

import { useMutation, usePlayer, useSelector } from "../hooks";
import { ModelSelector } from "../model";
import { PlayerlistItem } from "./player-list-item";

export function HubContent() {
  const hubViewState = useSelector(ModelSelector.getHubViewState);
  const mutations = useMutation();
  const player = usePlayer();

  useEffect(() => {
    if (!hubViewState.initialzie) {
      init();
    }

    async function init() {
      if (!player) {
        return;
      }

      const playlists = await player.apiService.getPlaylists();

      mutations.setHubViewState({
        playlists: playlists,
        initialzie: true,
      });
    }
  }, [player]);

  return (
    <div className="min-h-[200px] pb-2">
      <span className="animate-spin">
        {!hubViewState.initialzie && <Icon name="Loader" />}

        {hubViewState.playlists.map(item => (
          <PlayerlistItem
            id={item.id}
            key={item.id}
            title={item.name}
            tracksCount={item.tracks.length}
          />
        ))}
      </span>
    </div>
  );
}
