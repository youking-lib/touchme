import type { Player } from "./api";

declare global {
  interface Window {
    Player: Player;
  }
}
