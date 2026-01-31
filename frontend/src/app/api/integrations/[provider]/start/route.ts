import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function appUrl(req: Request) {
  const h = req.headers;
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

export async function GET(req: Request, { params }: { params: { provider?: string } }) {
  const provider = params?.provider;
  if (!provider) {
    return NextResponse.json({ error: "Missing provider" }, { status: 400 });
  }

  // Route provider to its OAuth start endpoint
  if (provider === "slack") {
    return NextResponse.redirect(new URL("/api/integrations/slack/oauth", appUrl(req)));
  }

  if (provider === "google_drive" || provider === "google_analytics") {
    const url = new URL("/api/integrations/google/oauth", appUrl(req));
    url.searchParams.set("product", provider);
    return NextResponse.redirect(url);
  }

  if (provider === "bitly") {
    return NextResponse.redirect(new URL("/api/integrations/bitly/oauth", appUrl(req)));
  }

  // Not wired yet
  return NextResponse.redirect(
    new URL(`/settings/integrations?notice=${encodeURIComponent(`Not wired yet: ${provider}`)}`, appUrl(req))
  );
}
