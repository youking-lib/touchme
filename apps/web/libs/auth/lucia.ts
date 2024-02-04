import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "../prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = createLucia();

function createLucia() {
  return new Lucia(adapter, {
    sessionCookie: {
      expires: false,
      attributes: {
        // set to `true` when using HTTPS
        secure: process.env.NODE_ENV === "production",
      },
    },
    getUserAttributes: data => {
      return data;
    },
  });
}
