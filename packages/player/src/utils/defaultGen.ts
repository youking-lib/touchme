import { LocalPlaylist } from "../model";

export function genDefaultLocalPlaylistName(tracks: LocalPlaylist["tracks"]) {
  if (tracks.length < 2) {
    return tracks[0].title || "untitled playlist";
  }

  const name = [tracks[0], tracks[1]]
    .filter(Boolean)
    .map(item => {
      return item.title;
    })
    .join(",");

  return `${name}... (${tracks.length} songs)`;
}
