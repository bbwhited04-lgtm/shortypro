# tools\gen-integrations.ps1
# Generates route files for all providers WITHOUT overwriting existing files.

$providersAll = @(
  "facebook","instagram","facebook_pages","facebook_groups","threads","x","linkedin","alignable","tiktok",
  "google_analytics","bing_webmaster","google_business",
  "canva","bynder","bitly","slack","google_drive","dropbox",
  "tableau","marketo","woocommerce","shopify","facebook_shop",
  "salesforce","hubspot","zendesk"
)

# Providers you said you have keys for (we'll create real placeholders if missing)
$wired = @("bitly","slack","tiktok","linkedin","x","zendesk","meta","google")

function Ensure-File($path, $content) {
  $dir = Split-Path $path -Parent
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  if (!(Test-Path $path)) {
    Set-Content -Path $path -Value $content -Encoding UTF8
    Write-Host "CREATED  $path"
  } else {
    Write-Host "SKIPPED  $path (exists)"
  }
}

# 0) Safe base endpoint
$baseRoute = @'
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET() {
  return NextResponse.json({ ok: true, message: "Use /api/integrations/:provider/start" });
}
'@
Ensure-File "src/app/api/integrations/route.ts" $baseRoute

# 1) Universal start router
$startRoute = @'
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
  if (!provider) return NextResponse.json({ error: "Missing provider" }, { status: 400 });

  const base = appUrl(req);

  // Your real wired providers (expected to exist):
  if (provider === "slack") return NextResponse.redirect(new URL("/api/integrations/slack/oauth", base));
  if (provider === "bitly") return NextResponse.redirect(new URL("/api/integrations/bitly/oauth", base));
  if (provider === "tiktok") return NextResponse.redirect(new URL("/api/integrations/tiktok/oauth", base));
  if (provider === "linkedin") return NextResponse.redirect(new URL("/api/integrations/linkedin/oauth", base));
  if (provider === "x") return NextResponse.redirect(new URL("/api/integrations/x/oauth", base));
  if (provider === "zendesk") return NextResponse.redirect(new URL("/api/integrations/zendesk/oauth", base));

  // Meta is a single connect flow that later yields FB/IG/Pages/Groups/Threads
  if (provider === "meta" || provider === "facebook" || provider === "instagram" || provider === "facebook_pages" || provider === "facebook_groups" || provider === "threads") {
    return NextResponse.redirect(new URL("/api/integrations/meta/oauth", base));
  }

  // Google shared handler (Drive + GA)
  if (provider === "google_drive" || provider === "google_analytics") {
    const url = new URL("/api/integrations/google/oauth", base);
    url.searchParams.set("product", provider);
    return NextResponse.redirect(url);
  }

  // fallback to stub oauth endpoint per provider
  return NextResponse.redirect(new URL(`/api/integrations/${provider}/oauth`, base));
}
'@
Ensure-File "src/app/api/integrations/[provider]/start/route.ts" $startRoute

# 2) Stubs for everything (safe)
$oauthStub = @'
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
'@

$callbackStub = @'
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
  return NextResponse.redirect(new URL(`/settings/integrations?notice=${encodeURIComponent("Callback hit (stub)")}`, base));
}
'@

foreach ($p in $providersAll) {
  Ensure-File "src/app/api/integrations/$p/oauth/route.ts" $oauthStub
  Ensure-File "src/app/api/integrations/$p/callback/route.ts" $callbackStub
}

# Ensure meta + google shared endpoints exist (stubs if you haven't made them yet)
Ensure-File "src/app/api/integrations/meta/oauth/route.ts" $oauthStub
Ensure-File "src/app/api/integrations/meta/callback/route.ts" $callbackStub
Ensure-File "src/app/api/integrations/google/oauth/route.ts" $oauthStub
Ensure-File "src/app/api/integrations/google/callback/route.ts" $callbackStub

Write-Host "`nDone. Build now: npm run build"
