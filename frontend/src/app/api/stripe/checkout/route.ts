export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

type Body = {
  priceId?: string | null;
  email?: string | null;
  successUrl?: string | null;
  cancelUrl?: string | null;
  plan?: string | null; // optional metadata
};

export async function POST(req: Request) {
  try {
    const stripe = getStripe();

    const body = (await req.json().catch(() => ({}))) as Body;

    const priceId = body.priceId?.trim() || "";
    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    const site =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://www.shortypro.com";

    const successUrl =
      body.successUrl?.trim() || `${site}/dashboard?checkout=success`;
    const cancelUrl =
      body.cancelUrl?.trim() || `${site}/pricing?checkout=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: body.email?.trim() || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      metadata: body.plan ? { plan: body.plan } : undefined,
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
