import { Player } from "@repo/player/player";

export default function Page(): JSX.Element {
  return (
    <main className="min-h-screen">
      <div className="absolute left-10 top-10">
        <Player />
      </div>
    </main>
  );
}
