import { useToast } from "@repo/ui";
import { useEffect } from "react";

export function UploadTask() {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Progress [2/10]",
      description: "Playlist [music.flac] 80%",
    });
  }, []);

  return <div></div>;
}
