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
    <div className="flex items-center border-b border-t space-x-1 py-4 px-2">
      <div className="flex-none cursor-pointer">
        <Icon name="ChevronLeft" size={24} />
      </div>

      <div className="grow flex items-center space-x-1">
        <div>
          <Icon name="DiscAlbum" size={48} />
        </div>

        <div>
          <div className="text-foreground font-bold">
            <Title playlist={playlist} />
          </div>

          <div className="text-secondray text-xs">
            {playlist.tracks.length} Tracks
          </div>
        </div>
      </div>

      <div
        className="flex-none cursor-pointer"
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
          className="border-none bg-transparent outline-none"
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
