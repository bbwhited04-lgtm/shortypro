import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");


export async function POST() {
  const session = await stripe.billingPortal.sessions.create({
    customer: "cus_REPLACE_WITH_REAL_CUSTOMER_ID",
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
