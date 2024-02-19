import { nanoid } from "nanoid";
import pickBy from "lodash/pickBy";
import localforage from "localforage";
import { parseBlob } from "music-metadata-browser";

import { Player } from "../api";
import { Track, LocalPlaylist, LocalFileTrack } from "../model";
import { PlaylistTrackSchema } from "@repo/schema";
import { genDefaultLocalPlaylistName } from "../utils/defaultGen";

const playlistStorage = localforage.createInstance({
  name: "playlist",
});

enum StorageKey {
  PlayingState = "PlayingState",
}

const defaultPlayState = {
  playingQueueId: null as string | null,
  playingTrackId: null as string | null,
  playingCurrentTime: null as number | null,
};

const storage = localforage.createInstance({
  name: "player",
});

export class LocalService {
  constructor(public api: Player) {}

  async setPlayingState(value: Partial<typeof defaultPlayState>) {
    const prev = await this.getPlayingState();

    return storage.setItem(StorageKey.PlayingState, {
      ...prev,
      ...value,
    });
  }

  async getPlayingState() {
    const state = await storage.getItem<typeof defaultPlayState>(
      StorageKey.PlayingState
    );
    return state || defaultPlayState;
  }

  async getPlaylists() {
    const playlists: LocalPlaylist[] = [];

    await playlistStorage.iterate<LocalPlaylist, void>(value => {
      if (value) {
        playlists.push(value);
      }
    });

    return playlists;
  }

  createPlaylist(playlist: Omit<LocalPlaylist, "id">) {
    const id = nanoid();
    const name = playlist.name || genDefaultLocalPlaylistName(playlist.tracks);

    return playlistStorage.setItem<LocalPlaylist>(id, {
      id,
      ...playlist,
      name,
    });
  }

  async getPlaylist(id: string) {
    const playlists = await this.getPlaylists();
    return playlists.find(item => item.id === id);
  }

  async updatePlaylist(id: string, input: Partial<LocalPlaylist>) {
    const playlist = await this.getPlaylist(id);

    if (playlist) {
      await playlistStorage.setItem<LocalPlaylist>(id, {
        ...playlist,
        ...input,
      });
    }
  }

  async importFiles(files: File[]) {
    const promises = files.map(file => this.parseMusicMetadata(file));
    const tracks = await Promise.all(promises);

    const playlist = this.createPlaylist({
      name: "",
      tracks,
    });

    return playlist;
  }

  async parseMusicMetadata(file: File): Promise<LocalFileTrack> {
    const { common, format, native, quality } = await parseBlob(file);

    console.log(native, quality, common, format);

    const artists = PlaylistTrackSchema.Formatter.trackFieldEncode(
      common.artists ||
        (common.artist && [common.artist]) ||
        (common.albumartist && [common.albumartist]) ||
        []
    );

    const metadata: Omit<Track, "id"> = {
      album: common.album || "",
      artists: artists,
      duration: format.duration || 0,
      genre: PlaylistTrackSchema.Formatter.trackFieldEncode(common.genre || []),
      title: common.title || "",
      format: format.codec?.toUpperCase()!,
      fileId: null,
      playlistId: null,
    };

    const id = nanoid();

    return {
      ...this.getDefaultMetadata(),
      ...pickBy(metadata),
      localFile: file,
      id,
    };
  }

  getDefaultMetadata(): Omit<Track, "id"> {
    return {
      album: "Unknown",
      artists: "Unknown artist",
      duration: 0,
      genre: "",
      title: "",
      format: "",
      fileId: null,
      playlistId: null,
    };
  }
}
