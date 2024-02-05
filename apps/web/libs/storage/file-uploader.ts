import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CloudflareR2Constants } from "@/libs/constant";
import { nanoid } from "nanoid";
import * as path from "path";

import { client } from "./s3";
import { prisma } from "../prisma";
import { md5 } from "../utils";

export async function upload(file: File, userId?: string) {
  const fileHash = await getOrUploadFile(file);

  return await prisma.file.create({
    data: {
      userId,
      filename: file.name,
      size: file.size,
      type: file.type,
      key: fileHash.key,
      fileHashId: fileHash.id,
    },
  });
}

export async function sign(Key: string) {
  return await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: CloudflareR2Constants.R2_BUCKET_NAME, Key }),
    { expiresIn: 3600 }
  );
}

async function getOrUploadFile(file: File) {
  const buffer = await file.arrayBuffer();
  const hash = md5(Buffer.from(buffer));

  const fileHash = await prisma.fileHash.findUnique({
    where: {
      hash,
    },
  });

  if (fileHash) {
    return fileHash;
  }

  const Key = `${CloudflareR2Constants}${nanoid()}${path.extname(file.name)}`;

  await client.send(
    new PutObjectCommand({
      Bucket: CloudflareR2Constants.R2_BUCKET_NAME,
      Body: file,
      Key,
    })
  );

  return prisma.fileHash.create({
    data: {
      hash,
      key: Key,
    },
  });
}
