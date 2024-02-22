import fs from "fs/promises";
import groupBy from "lodash/groupBy";
import {
  createTrack,
  importAsTrack,
  readAsImportTasks,
  readAsTrackInput,
} from "./utils";
import { prisma } from "@/libs/prisma";

readPath("/mnt/d/touchme-music/周杰伦");
// readPath("/mnt/d/BaiduSyncdisk/无损音乐");

async function readPath(path: string) {
  const stat = await fs.stat(path);

  if (stat.isDirectory()) {
    const tasks = await readAsImportTasks(path);

    for (let task of tasks) {
      await importFilesAsPlaylist(task.files);
    }
  }
}

async function importFilesAsPlaylist(filepaths: string[]) {
  const inputs = await readAsTrackInputs(filepaths);

  const dic = groupBy(inputs, item => item.album);

  await Promise.all(
    Object.entries(dic).map(async ([name, inputs]) => {
      if (!name) return null;

      const playlist = await prisma.playlist.create({
        data: {
          name,
        },
      });

      const tracks = await Promise.all(
        inputs.map(track =>
          createTrack({
            ...track,
            playlistId: playlist.id,
          })
        )
      );

      console.log(
        `created playlist ${playlist.name}, with ${tracks.length} tracks.`
      );

      return {
        playlist,
        tracks,
      };
    })
  );
}

async function readAsTrackInputs(filepaths: string[]) {
  const inputs = [];

  for (let filepath of filepaths) {
    const input = await readAsTrackInput(filepath);

    if (input) {
      console.log(`track input: [${input.album}] - ${input.title}`);

      inputs.push(input);
    } else {
      console.log("unknown" + filepath);
    }
  }

  return inputs;
}
