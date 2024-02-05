import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { cookies } from "next/headers";

import { prisma } from "../prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = createLucia();

export async function getSessionUser() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) return null;

  const { user } = await lucia.validateSession(sessionId);
  return user;
}

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
