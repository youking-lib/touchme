import "dotenv-flow/config";

import fs from "fs/promises";
import { prisma } from "@/libs/prisma";
import { Task, importAsTrack, readAsImportTasks } from "./utils";

readPath("/mnt/d/touchme-music/周杰伦");
// readPath("/mnt/d/BaiduSyncdisk/无损音乐");

async function readPath(path: string) {
  const stat = await fs.stat(path);

  if (stat.isDirectory()) {
    const tasks = await readAsImportTasks(path);

    for (let i = 0; i < tasks.length; i++) {
      await importTask(tasks[i]);
    }
  }

  const playlists = await prisma.playlist.findMany();

  console.log("playlists", playlists);
}

export async function importTask(task: Task) {
  const playlist = await prisma.playlist.create({
    data: {
      name: task.name,
    },
  });

  console.log("[created playlist]", playlist.name);

  for (let i = 0; i < task.files.length; i++) {
    const filepath = task.files[i];
    const track = await importAsTrack(filepath, playlist.id);

    if (track) {
      console.log("added track: " + track.title);
    } else {
      console.log("unknown" + filepath);
    }
  }
}
