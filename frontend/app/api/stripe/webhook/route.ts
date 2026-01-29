import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { planFromPriceId } from "@/src/lib/plans";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

async function upsertSubscriptionFromStripe(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const priceId = sub.items.data[0]?.price?.id || "";
  const plan = planFromPriceId(priceId);

  // Find email (best effort)
  let email: string | null = null;
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (!("deleted" in customer)) {
      email = (customer.email || null)?.toLowerCase() ?? null;
    }
  } catch {
    // ignore
  }

  if (!email) return;

  const user = await prisma.user.upsert({
    where: { email },
    update: { stripeCustomerId: customerId },
    create: { email, stripeCustomerId: customerId },
  });

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: sub.id },
    update: {
      stripePriceId: priceId,
      plan,
      status: sub.status,
      currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
      userId: user.id,
    },
    create: {
      stripeSubscriptionId: sub.id,
      stripePriceId: priceId,
      plan,
      status: sub.status,
      currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
      userId: user.id,
    },
  });
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verify failed: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // If this Payment Link is subscription-based, session.subscription will be set.
        const subId = session.subscription ? String(session.subscription) : null;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertSubscriptionFromStripe(sub);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscriptionFromStripe(sub);
        break;
      }

      default:
        break;
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
