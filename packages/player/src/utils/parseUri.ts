import isString from "lodash/isString";
import { readImageAsBase64 } from "./readImageAsBase64";
import { Track, isLocalFileTrack } from "../model";

export const parseUri = async (pathOrFile: string | File) => {
  if (isString(pathOrFile)) {
    return pathOrFile;
  }

  const res = await readImageAsBase64(pathOrFile);

  return res.src;
};

export const parseTrackUri = async (track: Track) => {
  if (!isLocalFileTrack(track) || track.fileId) {
    return track.fileId!;
  }

  return parseUri(track.localFile);
};
