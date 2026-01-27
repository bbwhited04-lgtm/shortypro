import { NextResponse } from "next/server";
import { ENV } from "@/lib/env";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const r = await fetch(`${ENV.API_BASE}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    return NextResponse.json({ ok: false, error: data?.detail || "Login failed" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, email: data.email, user_id: data.user_id });
  res.cookies.set({
    name: ENV.AUTH_COOKIE_NAME,
    value: data.token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return res;
}
