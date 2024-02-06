import { object, string } from "zod";

export const HashSignPostValidator = object({
  hash: string(),
  filename: string(),
});

export type HashSignPostInput = typeof HashSignPostValidator;
export type HashSignPostOutput =
  | {
      id: string;
      key: string;
      hash: string;
      signedUrl: null;
    }
  | {
      id: null;
      key: string;
      hash: string;
      signedUrl: string;
    };
