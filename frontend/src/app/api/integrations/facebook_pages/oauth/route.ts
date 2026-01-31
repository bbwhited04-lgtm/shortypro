import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
function appUrl(req: Request) {
  const h = req.headers;
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}
export async function GET(req: Request) {
  const base = appUrl(req);
  return NextResponse.redirect(new URL(`/settings/integrations?notice=${encodeURIComponent("OAuth not wired yet")}`, base));
}
