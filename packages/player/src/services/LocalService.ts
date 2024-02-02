import { nanoid } from "nanoid";
import pickBy from "lodash/pickBy";
import localforage from "localforage";
import { parseBlob } from "music-metadata-browser";

import { Player } from "../api";
import { Track, Playlist, FileTrack } from "../model";
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
    const playlists: Playlist[] = [];

    await playlistStorage.iterate<Playlist, void>(value => {
      if (value) {
        playlists.push(value);
      }
    });

    return playlists;
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

  async importFiles(files: File[]) {
    const promises = files.map(file => this.parseMusicMetadata(file));
    const tracks = await Promise.all(promises);

    const playlist = this.createPlaylist({
      name: "",
      tracks,
    });

    return playlist;
  }

  async parseMusicMetadata(file: File): Promise<FileTrack> {
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

    const id = nanoid();

    return {
      ...this.getDefaultMetadata(),
      ...pickBy(metadata),
      file,
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
