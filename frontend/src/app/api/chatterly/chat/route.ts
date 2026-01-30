import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json()) as { threadId?: string; message?: string };

  const msg = (body.message || "").trim();
  if (!msg) return NextResponse.json({ error: "Missing message" }, { status: 400 });

  // ✅ Stub response for now (replace with OpenAI calls later)
  const reply =
    `Here are 5 hook ideas based on: "${msg}"\n\n` +
    `1) The mistake almost everyone makes…\n` +
    `2) The 10-second trick that changes everything…\n` +
    `3) If you’re doing this, stop now…\n` +
    `4) The fastest way to get results (without burnout)…\n` +
    `5) Do THIS before you post again…\n\n` +
    `Want captions + CTA versions too?`;

  return NextResponse.json({ reply });
}
