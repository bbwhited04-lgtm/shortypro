export const sessionCookieName = "sp_session";

function b64urlEncode(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function b64urlDecode(str: string) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4 ? "=".repeat(4 - (str.length % 4)) : "";
  return Buffer.from(str + pad, "base64");
}

async function hmacSign(data: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return b64urlEncode(new Uint8Array(sig));
}

async function hmacVerify(data: string, sig: string, secret: string) {
  const expected = await hmacSign(data, secret);
  return expected === sig;
}

export type SessionPayload = {
  email: string;
  // plan is informational; real gate should be based on DB subscription status
  plan?: string;
  iat: number;
};

export async function signSession(payload: Omit<SessionPayload, "iat">): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET missing");

  const full: SessionPayload = { ...payload, iat: Date.now() };
  const body = b64urlEncode(new TextEncoder().encode(JSON.stringify(full)));
  const sig = await hmacSign(body, secret);
  return `${body}.${sig}`;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [body, sig] = parts;
  const ok = await hmacVerify(body, sig, secret);
  if (!ok) return null;

  try {
    const json = new TextDecoder().decode(b64urlDecode(body));
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}
