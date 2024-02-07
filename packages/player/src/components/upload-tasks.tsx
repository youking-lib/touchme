import { useToast } from "@repo/ui";
import { useEffect, useState } from "react";

import { usePlayer, useSelector } from "../hooks";
import { FileTrack, ModelSelector, UploadTask } from "../model";

export function UploadTasks() {
  const tasks = useSelector(ModelSelector.getUploadTasks);
  const task = tasks[0];

  return <div>{task && <UploadTaskToast task={task} />}</div>;
}

function UploadTaskToast({ task }: { task: UploadTask }) {
  const api = usePlayer();
  const { toast } = useToast();
  const [toastInstance, setToastInstance] = useState<ReturnType<
    typeof toast
  > | null>(null);

  const playlist = useSelector(state =>
    ModelSelector.getPlaylistById(state, task.localPlaylistId)
  );

  useEffect(() => {
    setToastInstance(
      toast({
        title: `Upload Progress ${playlist?.name}`,
      })
    );
  }, [task.localPlaylistId, playlist]);

  useEffect(() => {
    if (!toastInstance) return;
    if (!api) return;

    const uploaded = ModelSelector.getUploadTaskItemByStatus(
      api.getState(),
      task.localPlaylistId,
      "resolve"
    );
    const uploading = ModelSelector.getUploadTaskItemByStatus(
      api.getState(),
      task.localPlaylistId,
      "uploading"
    );

    toastInstance.update({
      title: `Upload Progress ${playlist?.name} [${uploaded.length}/${task.queue.length}]`,
      description: uploading.map(item => {
        const track = ModelSelector.getPlaylistTrackById(
          api.getState(),
          task.localPlaylistId,
          item.id
        ) as FileTrack;
        const filename = track.file.name;

        return (
          <div>
            [{filename}] ${(item.progress * 100).toFixed(2)}%{" "}
            {(item.rate / 1024).toFixed(2)}KB/s
          </div>
        );
      }),
    });
  }, [toastInstance, task, api]);

  return null;
}
