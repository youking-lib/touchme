import isString from "lodash/isString";
import { readImageAsBase64 } from "./readImageAsBase64";
import { FileTrack, Track, isFileTrack } from "../model";

export const parseUri = async (pathOrFile: string | File) => {
  if (isString(pathOrFile)) {
    return pathOrFile;
  }

  const res = await readImageAsBase64(pathOrFile);

  return res.src;
};

export const parseTrackUri = async (track: Track | FileTrack) => {
  if (!isFileTrack(track) || track.path) {
    return track.path;
  }

  return parseUri(track.file);
};
