import { NextResponse } from "next/server";
import { ENV } from "@/lib/env";
import { cookies } from "next/headers";

function tokenOr401() {
  const token = cookies().get(ENV.AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return token;
}

export async function GET() {
  const token = tokenOr401();
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  const r = await fetch(`${ENV.API_BASE}/profile`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}

export async function POST(req: Request) {
  const token = tokenOr401();
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const r = await fetch(`${ENV.API_BASE}/profile`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
