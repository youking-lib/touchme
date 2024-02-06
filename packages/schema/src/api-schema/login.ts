import { object, string } from "zod";

export const EmailVerifyPostValidator = object({
  email: string(),
});

export type EmailVerifyPostInput = typeof EmailVerifyPostValidator;
export type EmailVerifyPostOutput = unknown;

export const EmailSignInPostValidator = object({
  email: string(),
  code: string(),
});

export type EmailSignInPostInput = typeof EmailSignInPostValidator;
