import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
});

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

// Optional: guard so build doesn’t explode if env missing during local dev
function stripeReady() {
  return !!process.env.STRIPE_SECRET_KEY;
}

export async function POST(req: NextRequest) {
  try {
    if (!stripeReady()) {
      return NextResponse.json(
        { ok: false, error: "Stripe not configured (missing STRIPE_SECRET_KEY)" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action as string | undefined;

    // Common inputs
    const email = body?.email as string | undefined;
    const priceId = body?.priceId as string | undefined;

    if (!action) {
      return NextResponse.json(
        { ok: false, error: "Missing action" },
        { status: 400 }
      );
    }

    // --------
    // ACTION: create checkout session
    // --------
    if (action === "checkout") {
      if (!email) {
        return NextResponse.json(
          { ok: false, error: "Email required" },
          { status: 400 }
        );
      }
      if (!priceId) {
        return NextResponse.json(
          { ok: false, error: "priceId required" },
          { status: 400 }
        );
      }

      const origin =
        req.headers.get("origin") ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        "https://www.shortypro.com";

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: email,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cancel`,
        allow_promotion_codes: true,
      });

      return NextResponse.json({ ok: true, url: session.url });
    }

    // --------
    // ACTION: create billing portal session
    // --------
    if (action === "portal") {
      const customerId = body?.customerId as string | undefined;

      if (!customerId) {
        return NextResponse.json(
          { ok: false, error: "customerId required" },
          { status: 400 }
        );
      }

      const origin =
        req.headers.get("origin") ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        "https://www.shortypro.com";

      const portal = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${origin}/dashboard/billing`,
      });

      return NextResponse.json({ ok: true, url: portal.url });
    }

    return NextResponse.json(
      { ok: false, error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Billing error" },
      { status: 500 }
    );
  }
}
