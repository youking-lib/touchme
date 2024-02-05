import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CloudflareR2Constants } from "@/libs/constant";
// import * as path from "path";
// import { nanoid } from "nanoid";

export const client = new S3Client({
  region: "auto",
  endpoint: `https://${CloudflareR2Constants.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CloudflareR2Constants.R2_ACCESS_KEY_ID || "",
    secretAccessKey: CloudflareR2Constants.R2_SECRET_ACCESS_KEY || "",
  },
});
