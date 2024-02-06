import { useToast } from "@repo/ui";
import { useEffect } from "react";

export function UploadTask() {
  const { toast } = useToast();

  useEffect(() => {
    // @ts-ignore
    window["toast"] = toast;

    const res = toast({
      title: "Upload Progress Playlist",
      description: "[2/10] [music.flac] 80%",
    });
  }, []);

  return <div></div>;
}
