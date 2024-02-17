import { useEffect } from "react";
import { usePlayer, useSelector } from "../hooks";
import { ModelSelector } from "../model";
import { Icon } from "@repo/ui";

export function HubContent() {
  const playlists = useSelector(ModelSelector.getPlaylists);
  const player = usePlayer();

  useEffect(() => {
    if (!player) {
      return;
    }

    player.apiService.getPlaylists();
  }, [player]);

  return (
    <div className="min-h-[200px] pb-2">
      <span className="animate-spin">
        <Icon name="Loader" />
      </span>
    </div>
  );
}
