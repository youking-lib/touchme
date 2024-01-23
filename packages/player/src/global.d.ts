import type { PlayerApi } from "./PlayerApi";

declare global {
  interface Window {
    playerApi: PlayerApi;
  }
}
