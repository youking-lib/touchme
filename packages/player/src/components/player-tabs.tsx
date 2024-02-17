import { Icon, Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { PlayerList } from "./player-list";
import { HubContent } from "./hub-content";

export function PlayerTabs() {
  return (
    <Tabs defaultValue="playlist" className="rounded-b-xl bg-secondary">
      <TabsList>
        <TabsTrigger value="playlist">
          <Icon name="ListMusic" size={14} />{" "}
          <span className="ml-2">Playlist</span>
        </TabsTrigger>
        <TabsTrigger value="hub">
          <Icon name="Rss" size={14} /> <span className="ml-2">Hub</span>
        </TabsTrigger>

        <TabsTrigger value="cloud">
          <Icon name="Cloud" size={14} /> <span className="ml-2">Cloud</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="playlist" className="mt-0">
        <PlayerList />
      </TabsContent>
      <TabsContent value="hub">
        <HubContent />
      </TabsContent>
    </Tabs>
  );
}
