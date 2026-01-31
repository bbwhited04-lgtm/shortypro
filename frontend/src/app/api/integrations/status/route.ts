import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * TODO: replace demo-user with your real auth user id
 * TODO: replace with DB lookup for stored tokens
 */
export async function GET() {
  // For now: return empty (no connections)
  return NextResponse.json({
    userId: "demo-user",
    connected: [], // e.g. ["slack","google_drive"]
  });
}
