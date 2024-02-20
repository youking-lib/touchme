import { useEffect } from "react";
import { Icon } from "@repo/ui";

import { useMutation, usePlayer, useSelector } from "../hooks";
import { ModelSelector } from "../model";
import { HubPlaylists } from "./playlists";

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
    <div role="hub-content">
      {!hubViewState.initialzie && (
        <div className="flex justify-center">
          <span className="animate-spin inline-block">
            <Icon name="Loader" />
          </span>
        </div>
      )}

      <HubPlaylists />
    </div>
  );
}
