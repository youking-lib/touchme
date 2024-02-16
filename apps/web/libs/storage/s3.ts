import { S3Client } from "@aws-sdk/client-s3";
import { CloudflareR2Constants } from "@/libs/constant";

export const client = new S3Client({
  region: "auto",
  endpoint: `https://${CloudflareR2Constants.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CloudflareR2Constants.R2_ACCESS_KEY_ID || "",
    secretAccessKey: CloudflareR2Constants.R2_SECRET_ACCESS_KEY || "",
  },
});
