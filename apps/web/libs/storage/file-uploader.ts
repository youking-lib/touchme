import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CloudflareR2Constants } from "@/libs/constant";
import { nanoid } from "nanoid";
import * as path from "path";
import { md5 } from "js-md5";

import { client } from "./s3";
import { prisma } from "../prisma";

export async function upload(file: File, userId?: string) {
  const fileHash = await getOrUploadFile(file);

  return fileHash;
}

export async function getUploadedFileHash(hash: string) {
  const fileHash = await prisma.fileHash.findUnique({
    where: {
      hash,
    },
  });

  return fileHash;
}

export async function getPreSignedPutUrl(filename: string) {
  const Key = getFullKey(`${nanoid()}${path.extname(filename)}`);
  const preSignedUrl = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: CloudflareR2Constants.R2_BUCKET_NAME, Key }),
    { expiresIn: 3600 }
  );

  return {
    key: Key,
    preSignedUrl,
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

  const Key = getFullKey(`${nanoid()}${path.extname(file.name)}`);

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

export async function hashFile(Key: string) {
  const metadata = await getFileMetaData(Key);
  const hash = (metadata.ETag || "").slice(1, -1);

  return prisma.fileHash.create({
    data: {
      hash,
      key: Key,
    },
  });
}

export async function getFileMetaData(Key: string) {
  const res = await client.send(
    new HeadObjectCommand({
      Bucket: CloudflareR2Constants.R2_BUCKET_NAME,
      Key,
    })
  );

  return res;
}

export function getFullKey(filename: string) {
  return path.join(CloudflareR2Constants.BASE_PATH, filename);
}
