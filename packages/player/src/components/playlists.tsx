import {
  Accordion,
  Button,
  ChevronDownIcon,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Icon,
  Input,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui";
import Upload, { UploadProps } from "rc-upload";

import { ModelSelector, Playlist } from "../model";
import { useSelector, useMutation, useLazyPlayer } from "../hooks";
import { PlaylistItem } from "./playlist-item";

export function UserPlaylists() {
  const playlists = useSelector(ModelSelector.getPlaylists);
  const isEmpty = playlists.length === 0;

  if (isEmpty) {
    return <UploadLocal />;
  }

  return <Playlists playlists={playlists} />;
}

export function HubPlaylists() {
  const playlists = useSelector(
    state => ModelSelector.getHubViewState(state).playlists
  );
  const initialzie = useSelector(
    state => ModelSelector.getHubViewState(state).initialzie
  );

  if (!initialzie) {
    return null;
  }

  return (
    <div className="">
      <HubPlaylistFilter />

      <Playlists playlists={playlists} />

      <Pagination className="text-neutral-500">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" size="sm" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink size="sm" href="#">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext size="sm" href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function Playlists({
  playlists,
  ...playlistItemProps
}: {
  playlists: Playlist[];
}) {
  return (
    <div role="playlists">
      <Accordion type="single" collapsible className="w-full text-neutral-500">
        {playlists.map(item => {
          return (
            <PlaylistItem
              key={item.id}
              playlist={item}
              {...playlistItemProps}
            />
          );
        })}
      </Accordion>
    </div>
  );
}

function HubPlaylistFilter() {
  return (
    <div className="flex items-center p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="ml-auto text-neutral-500"
            size="sm"
          >
            Most stars <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-neutral-500">
          <DropdownMenuCheckboxItem
            className="capitalize"
            checked={true}
            onCheckedChange={value => {}}
          >
            Most stars
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            className="capitalize"
            onCheckedChange={value => {}}
          >
            Most listen to
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Input placeholder="Search by keyword..." className="text-xs p-2 h-8" />
    </div>
  );
}

function UploadLocal() {
  const loader = useLazyPlayer();
  const mutations = useMutation();

  const props: UploadProps = {
    async onBatchStart(files) {
      const player = await loader();

      await player.localService.importFiles(files.map(item => item.file));

      const playlists = await player.localService.getPlaylists();

      mutations.setLocalPlaylists(playlists);
    },
    async beforeUpload() {
      return false;
    },
    multiple: true,
  };

  return (
    <Upload
      className="min-h-[200px] rounded-xl border border-dashed flex items-center justify-center flex-col space-y-4 text-muted-foreground"
      {...props}
    >
      <Icon name="Upload" size={24} />

      <p className="text-xs">Drag local music files to this area</p>
    </Upload>
  );
}
