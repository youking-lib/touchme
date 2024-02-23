import { useCallback, useEffect, useRef, useState } from "react";
import {
  Icon,
  AccordionContent,
  AccordionItem,
  AccordionPrimitive,
  ChevronDownIcon,
} from "@repo/ui";

import { usePlayer, useSelector } from "../hooks";
import { ModelMutation, ModelSelector, Playlist } from "../model";
import { Playtracks } from "./player-tracks";

export type PlaylistItemProps = {
  playlist: Playlist;
};

export function PlaylistItem({ playlist }: PlaylistItemProps) {
  const api = usePlayer();

  const isLocalPlaylist = useSelector(state =>
    ModelSelector.getIsLocalPlaylist(state, playlist.id)
  );

  const onPlay = useCallback(() => {
    if (!api) return;

    api.setState(state => ModelMutation.setOrInitPlayQueue(state, playlist));
    api.play(playlist.tracks[0]);
  }, [api, playlist]);

  return (
    <AccordionItem value={playlist.id}>
      <AccordionPrimitive.Header className="flex p-1 gap-2">
        <AccordionPrimitive.Trigger className="flex items-center transition-all [&[data-state=open]>svg]:rotate-0">
          <ChevronDownIcon className="h-4 w-4 shrink-0 transition-transform duration-200 rotate-90" />

          <span className="inline-flex w-[48px] h-[48px] bg-neutral-950 flex-shrink-0 items-center justify-center">
            <Icon name="DiscAlbum" size={32} />
          </span>
        </AccordionPrimitive.Trigger>

        <div className="flex flex-1 items-center justify-between text-xs overflow-hidden gap-2">
          <div className="flex items-center space-x-2 overflow-hidden text-left">
            <div className="space-y-2 flex-1 overflow-hidden">
              <div
                className="w-full text-neutral-300 hover:underline cursor-pointer"
                onClick={onPlay}
              >
                <Title playlist={playlist} editable={isLocalPlaylist} />
              </div>

              <AccordionPrimitive.Trigger className="text-xs">
                {playlist.tracks.length} Songs
              </AccordionPrimitive.Trigger>
            </div>
          </div>

          {isLocalPlaylist ? (
            <LocalPlaylistUpload playlistId={playlist.id} />
          ) : (
            <HubPlaylistFork playlistId={playlist.id} />
          )}
        </div>
      </AccordionPrimitive.Header>
      <AccordionContent className="max-h-[212px] overflow-auto p-2">
        <Playtracks playlist={playlist} />
      </AccordionContent>
    </AccordionItem>
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
    <div className="text-xs text-ellipsis text-nowrap overflow-hidden">
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
          title={playlistTitle}
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
