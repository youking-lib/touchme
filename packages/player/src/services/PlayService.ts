import { Player } from "../api";
import { Track } from "../model";
import { parseTrackUri } from "../utils";

export class PlayService {
  private audio: HTMLAudioElement = new Audio();
  private track: Track | null = null;

  constructor(public api: Player) {}

  DEBUG_setAudioSrc(path: string) {
    this.audio.src = path;
  }

  async play() {
    if (!this.audio.src) {
      throw new Error("Trying to play a track but not audio.src is defined");
    }

    await this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
  }

  mute() {
    this.audio.muted = true;
  }

  unmute() {
    this.audio.muted = false;
  }

  getAudio() {
    return this.audio;
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getVolume() {
    return this.audio.volume;
  }

  setVolume(volume: number) {
    this.audio.volume = volume;
  }

  async setTrack(track: Track) {
    if (this.track !== track) {
      const path = await parseTrackUri(track);

      this.track = track;
      this.audio.src = path;
    }
  }

  setPlaybackRate(playbackRate: number) {
    this.audio.playbackRate = playbackRate;
    this.audio.defaultPlaybackRate = playbackRate;
  }

  setCurrentTime(currentTime: number) {
    this.audio.currentTime = currentTime;
  }

  isMuted() {
    return this.audio.muted;
  }

  isPaused() {
    return this.audio.paused;
  }
}
