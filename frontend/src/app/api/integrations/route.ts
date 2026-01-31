import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Use /api/integrations/:provider/start (e.g. /api/integrations/slack/start)",
  });
}
