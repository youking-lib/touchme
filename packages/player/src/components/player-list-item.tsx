import { useEffect, useRef, useState } from "react";
import { Icon } from "@repo/ui/icon";

import { usePlayer } from "../hooks";
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
        <div className="ui-text-foreground ui-font-bold">
          <Title playlist={playlist} />
        </div>
        <div className="ui-text-secondray ui-text-xs">
          {playlist.tracks.length} Tracks
        </div>
      </div>
    </div>
  );
}

function Title({ playlist }: PlayerlistItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const player = usePlayer();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.select();
    }
  }, [isEditing]);

  return (
    <>
      {isEditing ? (
        <input
          ref={inputRef}
          autoFocus
          className="ui-border-none ui-bg-transparent ui-outline-none"
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e: React.KeyboardEvent) => {
            const target = e.target as HTMLInputElement;
            const value = target.value;

            if (e.key === "Enter") {
              player?.apiService.updatePlaylistName(playlist.id, value);
            }

            if (e.key === "Escape") {
              setIsEditing(false);
            }
          }}
          defaultValue={playlist.name}
        />
      ) : (
        <span onDoubleClick={() => setIsEditing(true)}>{playlist.name}</span>
      )}
    </>
  );
}
