import "dotenv-flow/config";

import fs from "fs/promises";
import * as path from "path";
import { parseFile } from "music-metadata";
import { getOrUploadFile } from "@/libs/storage";
import {
  PlaylistAddTrackPostInput,
  PlaylistAddTrackPostValidator,
} from "@repo/schema";
import { prisma } from "@/libs/prisma";
import { trackFieldEncode } from "../app/api/playlist/[id]/add-track/format";

export type Task = {
  files: string[];
  name: string;
};

export async function readAsImportTasks(
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

export async function importAsTrack(filepath: string, playlistId?: string) {
  const input = await readAsTrackInput(filepath);

  if (!input) {
    return null;
  }

  const track = await createTrack({
    ...input,
    playlistId: playlistId,
  });

  return track;
}

export async function createTrack(data: PlaylistAddTrackPostInput) {
  const validation = PlaylistAddTrackPostValidator.safeParse(data);

  if (!validation.success) {
    throw validation.error.format();
  }

  return prisma.playlistTrack.create({
    data: {
      playlistId: validation.data.playlistId,
      album: validation.data.album,
      duration: validation.data.duration,
      artists: validation.data.artists,
      genre: validation.data.genre,
      title: validation.data.title,
      fileId: validation.data.fileId,
      format: validation.data.format,
    },
  });
}

export async function readAsTrackInput(filepath: string) {
  const file = await fs.readFile(filepath);
  const filename = path.basename(filepath);

  const metadata = await parseFile(filepath).catch(err => {
    return null;
  });

  if (!metadata) {
    return null;
  }

  const { common, format } = metadata;
  const { id: fileId } = await getOrUploadFile(file.buffer, filename);

  const track: PlaylistAddTrackPostInput = {
    playlistId: undefined,
    album: common.album || "",
    artists: trackFieldEncode(
      common.artists ||
        (common.artist && [common.artist]) ||
        (common.albumartist && [common.albumartist]) ||
        []
    ),
    duration: format.duration || 0,
    genre: trackFieldEncode(common.genre || []),
    title: common.title || filename,
    fileId,
    format: format.codec || "",
  };

  return track;
}
