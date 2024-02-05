import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CloudflareR2Constants } from "@/libs/constant";
import { nanoid } from "nanoid";
import * as path from "path";

import { client } from "./s3";

export async function upload(filename: string, file: File) {
  const Key = `${CloudflareR2Constants}${nanoid()}${path.extname(filename)}`;

  await client.send(
    new PutObjectCommand({
      Bucket: CloudflareR2Constants.R2_BUCKET_NAME,
      Body: file,
      Key,
    })
  );

  return Key;
}

export async function sign(Key: string) {
  return await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: CloudflareR2Constants.R2_BUCKET_NAME, Key }),
    { expiresIn: 3600 }
  );
}
