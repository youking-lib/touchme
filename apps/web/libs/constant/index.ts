export const EMAIL_FROM = "";

export const CloudflareR2Constants = {
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID!,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY!,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME!,

  BASE_PATH: "static/music/",
};

export const EmailContants = {
  HOST: process.env.EMAIL_HOST,
  PORT: process.env.EMAIL_PORT,
  AUTH_USER: process.env.EMAIL_USER,
  AUTH_PASS: process.env.EMAIL_PASS,
  FROM: process.env.EMAIL_FROM,
};
