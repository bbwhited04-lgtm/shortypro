import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function GET() {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription", // change to "payment" if you ever make it one-time
      line_items: [
        {
          price: "price_1Svf9SKC49F2A9OzZ8X4OIL6",
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/dream`,
      metadata: {
        product: "dream",
        plan: "own_the_stack",
      },
      allow_promotion_codes: true,
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: "Unable to start checkout" },
      { status: 500 }
    );
  }
}
