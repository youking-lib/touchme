import { Icon } from "@repo/ui/icon";
import { Playlist } from "../model";

type PlayerlistItemProps = {
  playlist: Playlist;
};

export function PlayerlistItem({ playlist }: PlayerlistItemProps) {
  return (
    <div className="ui-py-4 ui-px-2 ui-flex ui-items-center ui-border-b ui-border-t ui-space-x-1">
      <div className="ui-cursor-pointer">
        <Icon name="ChevronLeft" size={24} />
      </div>

      <div>
        <Icon name="DiscAlbum" size={48} />
      </div>

      <div>
        <div className="ui-text-foreground ui-font-bold">{playlist.name}</div>
        <div className="ui-text-secondray ui-text-xs">
          {playlist.tracks.length} Tracks
        </div>
      </div>
    </div>
  );
}
