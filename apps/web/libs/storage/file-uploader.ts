import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CloudflareR2Constants } from "@/libs/constant";
import { nanoid } from "nanoid";
import * as path from "path";
import { md5 } from "js-md5";

import { client } from "./s3";
import { prisma } from "../prisma";

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

export async function getOrSignFileHash(hash: string, filename: string) {
  const fileHash = await prisma.fileHash.findUnique({
    where: {
      hash,
    },
  });

  if (fileHash) {
    return {
      fileHash,
      signedUrl: null,
    };
  }

  const Key = path.join(
    CloudflareR2Constants.BASE_PATH,
    `${nanoid()}${path.extname(filename)}`
  );

  const signedUrl = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: CloudflareR2Constants.R2_BUCKET_NAME, Key }),
    { expiresIn: 3600 }
  );

  return {
    fileHash: {
      hash,
      key: Key,
    },
    signedUrl,
  };
}

async function getOrUploadFile(file: File) {
  const buffer = await file.arrayBuffer();
  const hash = md5(buffer);

  const fileHash = await prisma.fileHash.findUnique({
    where: {
      hash,
    },
  });

  if (fileHash) {
    return fileHash;
  }

  const Key = path.join(
    CloudflareR2Constants.BASE_PATH,
    `${nanoid()}${path.extname(file.name)}`
  );

  await client.send(
    new PutObjectCommand({
      Bucket: CloudflareR2Constants.R2_BUCKET_NAME,
      Body: Buffer.from(buffer),
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
