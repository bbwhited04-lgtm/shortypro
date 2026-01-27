import { NextResponse } from "next/server";
import { ENV } from "@/lib/env";
import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get(ENV.AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  const r = await fetch(`${ENV.API_BASE}/auth/me`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, ...data });
}
