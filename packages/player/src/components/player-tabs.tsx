import { Icon, Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { UserPlaylists } from "./playlists";
import { HubContent } from "./hub-content";

export function PlayerTabs() {
  return (
    <Tabs
      defaultValue="playlist"
      className="rounded-b-xl bg-secondary min-h-[600px]"
    >
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
      <TabsContent value="playlist" className="pb-2 mt-0">
        <UserPlaylists />
      </TabsContent>
      <TabsContent value="hub" className="pb-2 mt-0">
        <HubContent />
      </TabsContent>
    </Tabs>
  );
}
