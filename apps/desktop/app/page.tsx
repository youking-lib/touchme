import { Player } from "@repo/player/player";

export default function Page(): JSX.Element {
  return (
    <main className="min-h-screen bg-card overflow-hidden">
      <div
        className="h-6 fixed top-0 left-0 w-full"
        data-tauri-drag-region="self"
      ></div>
      <Player
        className="pt-6 min-h-screen overflow-hidden"
        initialState={{
          baseUrl: "http://localhost:3000/",
        }}
      />
    </main>
  );
}
