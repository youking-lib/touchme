import { nanoid } from "nanoid";
import pickBy from "lodash/pickBy";
import localforage from "localforage";
import { parseBlob } from "music-metadata-browser";

import { Player } from "../api";
import { Track, Playlist } from "../model";
import { readImageAsBase64 } from "../utils";

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
    const playlist: Playlist[] = [];

    await playlistStorage.iterate<Playlist, void>(value => {
      if (value) {
        playlist.push(value);
      }
    });

    return playlist;
  }

  createPlaylist(playlist: Omit<Playlist, "id">) {
    const id = nanoid();

    return playlistStorage.setItem<Playlist>(id, {
      id,
      ...playlist,
    });
  }

  async getPlaylist(id: string) {
    const playlists = await this.getPlaylists();
    return playlists.find(item => item.id === id);
  }

  async updatePlaylist(id: string, input: Partial<Playlist>) {
    const playlist = await this.getPlaylist(id);

    if (playlist) {
      await playlistStorage.setItem<Playlist>(id, {
        ...playlist,
        ...input,
      });
    }
  }

  importFiles(files: File[]) {
    const tracks = files.map(file => {
      return this.parseMusicMetadata(file);
    });

    return Promise.all(tracks);
  }

  async parseMusicMetadata(file: File): Promise<Track> {
    const { common, format, native, quality } = await parseBlob(file);

    console.log(native, quality, common, format);

    const metadata = {
      album: common.album,
      artist:
        common.artists ||
        (common.artist && [common.artist]) ||
        (common.albumartist && [common.albumartist]),
      disk: common.disk,
      duration: format.duration,
      genre: common.genre,
      title: common.title,
      track: common.track,
      year: common.year,
    };

    const { src } = await readImageAsBase64(file);
    const id = nanoid();

    return {
      ...this.getDefaultMetadata(),
      ...pickBy(metadata),
      path: src,
      id,
    };
  }

  getDefaultMetadata(): Omit<Track, "id"> {
    return {
      album: "Unknown",
      artist: ["Unknown artist"],
      disk: {
        no: 0,
        of: 0,
      },
      duration: 0,
      genre: [],
      loweredMetas: {
        artist: ["unknown artist"],
        album: "unknown",
        title: "",
        genre: [],
      },
      path: "",
      playCount: 0,
      title: "",
      track: {
        no: 0,
        of: 0,
      },
      year: null,
    };
  }
}
