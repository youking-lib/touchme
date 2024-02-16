import { FileHash } from "@prisma/client";
import z, { object, string } from "zod";

export const FileHashPostValidator = object({
  key: string(),
});

export type FileHashPostInput = z.infer<typeof FileHashPostValidator>;
export type FileHashPostOutput = FileHash;
