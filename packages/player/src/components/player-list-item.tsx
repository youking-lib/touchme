import { useEffect, useRef, useState } from "react";
import { Icon } from "@repo/ui";

import { usePlayer } from "../hooks";
import { Playlist } from "../model";

type PlayerlistItemProps = {
  playlist: Playlist;
};

export function PlayerlistItem({ playlist }: PlayerlistItemProps) {
  const api = usePlayer();

  return (
    <div className="ui-flex ui-items-center ui-border-b ui-border-t ui-space-x-1 ui-py-4 ui-px-2">
      <div className="ui-flex-none ui-cursor-pointer">
        <Icon name="ChevronLeft" size={24} />
      </div>

      <div className="ui-grow ui-flex ui-items-center ui-space-x-1">
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

      <div
        className="ui-flex-none ui-cursor-pointer"
        onClick={() => {
          api?.apiService.uploadPlaylist(playlist.id);
        }}
      >
        <Icon name="UploadCloud" size={16} />
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

  const title = getTitle(playlist);

  return (
    <>
      {isEditing ? (
        <input
          ref={inputRef}
          autoFocus
          className="ui-border-none ui-bg-transparent ui-outline-none"
          onBlur={() => setIsEditing(false)}
          onKeyDown={async (e: React.KeyboardEvent) => {
            const target = e.target as HTMLInputElement;
            const value = target.value;

            if (e.key === "Enter") {
              await player?.apiService.updatePlaylistName(playlist.id, value);
              setIsEditing(false);
            }

            if (e.key === "Escape") {
              setIsEditing(false);
            }
          }}
          defaultValue={title}
        />
      ) : (
        <span onDoubleClick={() => setIsEditing(true)}>{title}</span>
      )}
    </>
  );
}

export const getTitle = (playlist: Playlist) => {
  return playlist.name || "Playlist";
};
