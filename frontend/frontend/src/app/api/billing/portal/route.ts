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
      );
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
