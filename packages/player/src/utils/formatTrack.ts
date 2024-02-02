import { readImageAsBase64 } from "./readImageAsBase64";
import { FileTrack, Track, isFileTrack } from "../model";
import { produce } from "immer";

export const formatTrack = async (track: Track | FileTrack) => {
  if (isFileTrack(track)) {
    const path = await readImageAsBase64(track.file);

    return produce(track, draft => {
      draft.path = path.src;
    });
  }

  return track;
};
