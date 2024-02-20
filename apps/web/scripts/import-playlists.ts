import "dotenv-flow/config";

import fs from "fs/promises";
import * as path from "path";
import { parseFile } from "music-metadata";
import { prisma } from "@/libs/prisma";
import { getOrUploadFile } from "@/libs/storage";
import {
  PlaylistAddTrackPostInput,
  PlaylistAddTrackPostValidator,
} from "@repo/schema";
import { trackFieldEncode } from "../app/api/playlist/[id]/add-track/format";

readPath("/mnt/d/touchme-music/周杰伦");
// readPath("/mnt/d/BaiduSyncdisk/无损音乐");

async function readPath(path: string) {
  const stat = await fs.stat(path);

  if (stat.isDirectory()) {
    const tasks = await readAsImportTasks(path);

    for (let i = 0; i < tasks.length; i++) {
      await importTask(tasks[0]);
    }
  }

  const playlists = await prisma.playlist.findMany();

  console.log("playlists", playlists);
}

type Task = {
  files: string[];
  name: string;
};

async function importTask(task: Task) {
  const playlist = await prisma.playlist.create({
    data: {
      name: task.name,
    },
  });

  console.log("[created playlist]", playlist.name);

  for (let i = 0; i < task.files.length; i++) {
    const filepath = task.files[i];
    const filename = path.basename(filepath);
    const file = await fs.readFile(filepath);
    const { common, format } = await parseFile(filepath);
    const { id: fileId } = await getOrUploadFile(file.buffer, filename);

    const trackData: PlaylistAddTrackPostInput = {
      playlistId: playlist.id,
      album: common.album || "",
      artist:
        common.artists ||
        (common.artist && [common.artist]) ||
        (common.albumartist && [common.albumartist]) ||
        [],
      duration: format.duration || 0,
      genre: common.genre || [],
      title: common.title || filename,
      fileId,
      format: format.codec || "",
    };

    const track = await createTrack(trackData);

    console.log("added track: " + track.title);
  }
}

async function createTrack(data: PlaylistAddTrackPostInput) {
  const validation = PlaylistAddTrackPostValidator.safeParse(data);

  if (!validation.success) {
    throw validation.error.format();
  }

  return prisma.playlistTrack.create({
    data: {
      playlistId: validation.data.playlistId,
      album: validation.data.album,
      duration: validation.data.duration,
      artists: trackFieldEncode(validation.data.artist),
      genre: trackFieldEncode(validation.data.genre),
      title: validation.data.title,
      fileId: validation.data.fileId,
      format: validation.data.format,
    },
  });
}

async function readAsImportTasks(
  root: string,
  options: { prefix?: string } = {}
) {
  const { prefix = "" } = options;
  const tasks: Task[] = [];
  const basename = path.basename(root);

  const dirs = await fs.readdir(root);
  const files: string[] = [];

  for (let i = 0; i < dirs.length; i++) {
    const p = path.join(root, dirs[i]);
    const stat = await fs.stat(p);

    if (stat.isFile()) {
      files.push(p);
    } else if (stat.isDirectory()) {
      const childTasks = await readAsImportTasks(p, {
        prefix: basename,
      });

      tasks.push(...childTasks);
    }
  }

  if (files.length > 0) {
    const taskname = prefix ? prefix + " - " + basename : basename;

    tasks.unshift({
      name: taskname,
      files,
    });
  }

  return tasks;
}
