import { NextRequest, NextResponse } from "next/server";

function uint8ToBase64Url(bytes: Uint8Array) {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  const b64 = btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return b64;
}

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({}));

  const serverPass = process.env.DASH_PASSWORD;
  const secret = process.env.DASH_AUTH_SECRET;

  if (!serverPass || !secret) {
    return NextResponse.json({ ok: false, error: "Auth misconfigured" }, { status: 500 });
  }

  if (!password || password !== serverPass) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }

  // Create signed payload with 7-day expiration
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = { exp };
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, payloadBytes);
  const token = `${uint8ToBase64Url(payloadBytes)}.${uint8ToBase64Url(new Uint8Array(sig))}`;

  const res = NextResponse.json({ ok: true });

  res.cookies.set({
    name: "sp_dash",
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // seconds
  });

  return res;
}
