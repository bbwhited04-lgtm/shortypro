import { NextRequest, NextResponse } from "next/server";

function base64urlToUint8Array(input: string) {
  const pad = "=".repeat((4 - (input.length % 4)) % 4);
  const base64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

async function verifyToken(token: string, secret: string) {
  // token format: base64url(payload).base64url(sig)
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [p64, s64] = parts;
  const payloadBytes = base64urlToUint8Array(p64);
  const sigBytes = base64urlToUint8Array(s64);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const ok = await crypto.subtle.verify("HMAC", key, sigBytes, payloadBytes);
  if (!ok) return null;

  const payloadJson = new TextDecoder().decode(payloadBytes);
  const payload = JSON.parse(payloadJson);

  if (!payload?.exp || Date.now() > payload.exp) return null;
  return payload;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page + auth endpoints
  if (pathname === "/dashboard/login.html") return NextResponse.next();
  if (pathname.startsWith("/api/auth/")) return NextResponse.next();

  // Allow health checks if you want them public
  if (pathname === "/api/health") return NextResponse.next();

  const needsAuth =
    pathname.startsWith("/dashboard/") ||
    pathname.startsWith("/api/uploads");

  if (!needsAuth) return NextResponse.next();

  const secret = process.env.DASH_AUTH_SECRET;
  if (!secret) {
    // Fail closed if secret missing
    return new NextResponse("Auth misconfigured: missing DASH_AUTH_SECRET", { status: 500 });
  }

  const token = req.cookies.get("sp_dash")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard/login.html";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const payload = await verifyToken(token, secret);
  if (!payload) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard/login.html";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
