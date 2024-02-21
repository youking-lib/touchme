import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Icon } from "@repo/ui";

import { usePlayer, useSelector } from "../hooks";
import { ModelSelector, Playlist, isLocalFileTrack } from "../model";
import { Playtracks } from "./player-tracks";
import clsx from "clsx";

export type PlaylistItemProps = {
  playlist: Playlist;
  defaultTrackHeight?: number;
};

export function PlaylistItem({
  playlist,
  defaultTrackHeight = 200,
}: PlaylistItemProps) {
  const playingQueueItem = useSelector(ModelSelector.getPlayingQueue);
  const [open, setOpen] = useState(playingQueueItem?.id === playlist.id);
  const tracksWrapperRef = useRef<HTMLDivElement>(null);
  const tracksWrapperStyle = useSpring({
    maxHeight: open ? defaultTrackHeight : 0,
  });

  const isLocalPlaylist = useSelector(state =>
    ModelSelector.getIsLocalPlaylist(state, playlist.id)
  );

  return (
    <div className="text-neutral-500">
      <div
        className="flex items-center border-b border-t gap-2 p-2"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className="flex-none cursor-pointer">
          <span
            className={clsx("inline-block transition", {
              "-rotate-90": open,
              "rotate-0": !open,
            })}
          >
            <Icon name="ChevronLeft" size={18} />
          </span>
        </div>

        <div className="flex-1 flex items-center space-x-2 overflow-hidden">
          <div className="w-[48px] h-[48px] bg-neutral-950 flex-shrink-0 flex items-center justify-center">
            <Icon name="DiscAlbum" size={32} />
          </div>

          <div className="space-y-2 flex-1 overflow-hidden">
            <div className="w-full text-neutral-300">
              <Title playlist={playlist} editable={isLocalPlaylist} />
            </div>

            <div className="text-xs">{playlist.tracks.length} Songs</div>
          </div>
        </div>

        {isLocalPlaylist ? (
          <LocalPlaylistUpload playlistId={playlist.id} />
        ) : (
          <HubPlaylistFork playlistId={playlist.id} />
        )}
      </div>

      <animated.div
        style={tracksWrapperStyle}
        className="overflow-auto"
        ref={tracksWrapperRef}
      >
        <Playtracks playlist={playlist} />
      </animated.div>
    </div>
  );
}

function LocalPlaylistUpload({ playlistId }: { playlistId: string }) {
  const api = usePlayer();

  return (
    <div
      className="flex-none cursor-pointer"
      onClick={() => {
        api?.apiService.uploadPlaylist(playlistId);
      }}
    >
      <Icon name="UploadCloud" size={14} />
    </div>
  );
}

function HubPlaylistFork({ playlistId }: { playlistId: string }) {
  const api = usePlayer();

  return (
    <div className="flex cursor-pointer gap-2">
      <Icon name="Star" size={14} />
      <Icon name="Headphones" size={14} />
    </div>
  );
}

function Title({
  playlist,
  editable,
}: {
  playlist: Playlist;
  editable: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const player = usePlayer();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.select();
    }
  }, [isEditing]);

  const playlistTitle = getTitle(playlist.name);

  return (
    <div
      onClick={e => e.stopPropagation()}
      className="text-sm text-ellipsis text-nowrap overflow-hidden"
    >
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
          defaultValue={playlistTitle}
        />
      ) : (
        <span
          onDoubleClick={() => {
            if (editable) {
              setIsEditing(true);
            }
          }}
        >
          {playlistTitle}
        </span>
      )}
    </div>
  );
}

export const getTitle = (title: string) => {
  return title || "Playlist";
};
