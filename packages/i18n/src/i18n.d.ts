// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import player from "./locales/en/player.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    defaultNS: "player";
    resources: {
      player: typeof player;
    };
  }
}
