import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const PRICE_MAP: Record<string, string> = {
  Starter: "price_STARTER_ID",
  Pro: "price_PRO_ID",
  Agency: "price_AGENCY_ID",
};

export async function POST(req: Request) {
  const { plan } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: PRICE_MAP[plan],
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
