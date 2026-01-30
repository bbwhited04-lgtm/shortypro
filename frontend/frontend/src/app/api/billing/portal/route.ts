import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email required" },
        { status: 400 }
      );import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
    }

    const appUrl = process.env.APP_URL || "https://www.shortypro.com";

    // 1) Look up customer
    const customers = await stripe.customers.list({ email, limit: 1 });

    // 2) If no customer yet, send them to Checkout instead of failing
    if (!customers.data.length) {
      const pricePro = process.env.STRIPE_PRICE_PRO;
      if (!pricePro) {
        return NextResponse.json(
          { ok: false, error: "Missing STRIPE_PRICE_PRO env var" },
          { status: 500 }
        );
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: pricePro, quantity: 1 }],
        success_url: `${appUrl}/dashboard/index.html?billing=success`,
        cancel_url: `${appUrl}/dashboard/index.html?billing=cancel`,
        customer_email: email,
        allow_promotion_codes: true,
      });

      return NextResponse.json({
        ok: true,
        url: session.url,
        note: "No billing account found — sending to checkout to create one."
      });
    }

    // 3) Customer exists → open portal
    const customerId = customers.data[0].id;

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard/index.html`,
    });

    return NextResponse.json({ ok: true, url: portal.url });
  } catch (err) {
    console.error("Stripe portal error:", err);
    return NextResponse.json({ ok: false, error: "Stripe portal error" }, { status: 500 });
  }
}

    }

    // Find Stripe customer by email
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (!customers.data.length) {
      return NextResponse.json(
        { ok: false, error: "No Stripe customer found" },
        { status: 404 }
      );
    }

    const customerId = customers.data[0].id;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL}/dashboard/index.html`,
    });

    return NextResponse.json({ ok: true, url: portalSession.url });
  } catch (err) {
    console.error("Stripe portal error:", err);
    return NextResponse.json(
      { ok: false, error: "Stripe portal error" },
      { status: 500 }
    );
  }
}
