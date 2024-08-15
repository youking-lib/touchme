import React from "react";
import { I18nextProvider, useTranslation } from "react-i18next";

import PLAYER_EN from "./locales/player-en.json";

import intl, { i18n } from "i18next";

export { useTranslation };

export function init() {
  intl.init({
    resources: {
      en: {
        translation: PLAYER_EN,
      },
    },
  });
  return intl;
}

export function Provider({
  children,
}: React.PropsWithChildren<{ i18n: i18n }>) {
  return <I18nextProvider i18n={intl}>{children}</I18nextProvider>;
}
