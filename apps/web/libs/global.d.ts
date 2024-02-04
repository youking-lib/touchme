import { User } from "@prisma/client";
import { lucia } from "./auth/lucia";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: LuciaUserAttributes;
  }
}

interface LuciaUserAttributes extends User {}
