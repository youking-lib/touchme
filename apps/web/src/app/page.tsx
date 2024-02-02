import { Player } from "@repo/player/player";
import { SlideImage } from "@repo/slide-image/react";

export default function Page(): JSX.Element {
  return (
    <main className="min-h-screen">
      {/* <SlideImage style={{ height: "100vh", width: "100vw" }} /> */}

      <div className="absolute left-10 top-10">
        <Player />
      </div>
    </main>
  );
}
