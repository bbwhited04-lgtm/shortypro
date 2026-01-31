export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();

    const body = (await req.json().catch(() => ({}))) as {
      email?: string;
      priceId?: string;
      successUrl?: string;
      cancelUrl?: string;
    };

    // Prefer env var, fallback to body, final fallback is empty -> error
    const priceId =
      process.env.STRIPE_PRICE_DREAM?.trim() ||
      body.priceId?.trim() ||
      "";

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing Dream priceId (set STRIPE_PRICE_DREAM or pass priceId)" },
        { status: 400 }
      );
    }

    const site =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://www.shortypro.com";

    const successUrl = body.successUrl?.trim() || `${site}/dashboard?upgrade=success`;
    const cancelUrl = body.cancelUrl?.trim() || `${site}/dashboard?upgrade=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: body.email?.trim() || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      metadata: { plan: "dream" }
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST" }, { status: 405 });
}
