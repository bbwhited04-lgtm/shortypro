import { SignJWT, jwtVerify } from "jose";
import type { Plan } from "./plans";

const COOKIE_NAME = "sp_session";
const encoder = new TextEncoder();

export type SessionPayload = {
  sub: string;          // user email
  plan: Plan;           // none | starter | pro | agency
  status: string;       // active | trialing | ...
};

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return encoder.encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  // 14 days
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14;
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setExpirationTime(exp)
    .setIssuedAt()
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function sessionCookieName(): string {
  return COOKIE_NAME;
}
