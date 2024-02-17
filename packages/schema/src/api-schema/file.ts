import z, { object, string } from "zod";

export const HashSignPostValidator = object({
  hash: string(),
  filename: string(),
});

export type HashSignPostInput = z.infer<typeof HashSignPostValidator>;
export type HashSignPostOutput = {
  id?: string;
  hash?: string;
  key: string;
  preSignedUrl?: string;
};