import isString from "lodash/isString";
import { readImageAsBase64 } from "./readImageAsBase64";

export const parseUri = (pathOrFile: string | File) => {
  if (isString(pathOrFile)) {
    return pathOrFile;
  }

  return readImageAsBase64(pathOrFile);
};
