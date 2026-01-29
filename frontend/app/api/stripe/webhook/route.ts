import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Keep Stripe API pinned; any modern apiVersion is fine as long as it's valid for your account.
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown webhook error";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // If subscription checkout, session.subscription may exist:
        // const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

        // If you want email mapping:
        // const email = session.customer_details?.email ?? session.customer_email ?? null;

        // TODO: write to DB here
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        // TODO: write subscription status/price to DB here
        // const status = sub.status;
        // const priceId = sub.items.data?.[0]?.price?.id;

        void sub;
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown handler error";
    return NextResponse.json({ error: `Webhook handler failed: ${message}` }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
