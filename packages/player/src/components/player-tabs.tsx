import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { PlayerList } from "./player-list";
import { Icon } from "@repo/ui/icon";

export function PlayerTabs() {
  return (
    <Tabs defaultValue="playlist" className="ui-rounded-b-xl ui-bg-secondary">
      <TabsList>
        <TabsTrigger value="playlist">
          <Icon name="ListMusic" size={14} />{" "}
          <span className="ui-ml-2">Playlist</span>
        </TabsTrigger>
        <TabsTrigger value="hub">
          <Icon name="Rss" size={14} /> <span className="ui-ml-2">Hub</span>
        </TabsTrigger>

        <TabsTrigger value="cloud">
          <Icon name="Cloud" size={14} /> <span className="ui-ml-2">Cloud</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="playlist" className="ui-mt-0">
        <PlayerList />
      </TabsContent>
      <TabsContent value="hub">Change your password here.</TabsContent>
    </Tabs>
  );
}
