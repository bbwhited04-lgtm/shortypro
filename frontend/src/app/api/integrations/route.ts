import { NextResponse } from "next/server";
import { PROVIDERS } from "@/lib/integrations/providers";

export async function GET(
  _req: Request,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider;

  const found = PROVIDERS.find((p) => p.id === provider);
  if (!found) return NextResponse.json({ error: "Unknown provider" }, { status: 404 });

  // For now: show a friendly placeholder until each provider’s OAuth is wired.
  // Next step: build provider-specific auth URLs and redirect users there.
  return NextResponse.redirect(
    new URL(`/settings/integrations?notice=${encodeURIComponent(`${found.name}: OAuth wiring not enabled yet`)}`, "http://localhost:3000")
  );
}
