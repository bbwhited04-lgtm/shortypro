import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const base = process.env.CHATTERLY_BACKEND_URL;

  if (!base) {
    return NextResponse.json(
      {
        error: "Missing CHATTERLY_BACKEND_URL",
        fix: "Add CHATTERLY_BACKEND_URL to .env.local and restart `npm run dev`",
      },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const upstream = await fetch(`${base}/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await upstream.text();

    // Try parse JSON, but don't crash if it's HTML/text
    let data: any = null;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { raw };
    }

    return NextResponse.json(
      {
        ok: upstream.ok,
        upstreamStatus: upstream.status,
        base,
        ...data,
      },
      { status: upstream.ok ? 200 : upstream.status }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        error: e?.message ?? "Unknown error",
        base,
        hint:
          "Most common: backend is down / wrong port / wrong URL / not returning JSON",
      },
      { status: 500 }
    );
  }
}
