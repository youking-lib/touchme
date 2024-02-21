"use client";

import "@repo/ui/styles.css";

import { Main, MainProps } from "./components/main";

export type PlayerProps = MainProps;

export function Player(props: PlayerProps): JSX.Element {
  return <Main {...props} />;
}
