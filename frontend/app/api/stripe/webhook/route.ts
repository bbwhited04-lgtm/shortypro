import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { planFromPriceId } from "@/src/lib/plans";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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

        const email =
          session.customer_details?.email ??
          session.customer_email ??
          null;

        // Payment Links may not always include line items in the event.
        // We'll try to map from a subscription later; for now we store customer id + email.
        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;

        if (email) {
          await prisma.user.upsert({
            where: { email },
            create: { email },
            update: {},
          });

          // If we have customer id, store it for later linkage
          if (stripeCustomerId) {
            await prisma.user.update({
              where: { email },
              data: { stripeCustomerId },
            });
          }
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const stripeCustomerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

        const stripeSubscriptionId = sub.id;
        const status = sub.status ?? "none";

        const priceId =
          sub.items?.data?.[0]?.price?.id ?? null;

        const plan = planFromPriceId(priceId);

        const currentPeriodEnd = sub.current_period_end
          ? new Date(sub.current_period_end * 1000)
          : null;

        if (stripeCustomerId) {
          // Find user by stored customer id
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId },
          });

          if (user) {
            await prisma.subscription.upsert({
              where: { stripeSubscriptionId },
              create: {
                userId: user.id,
                stripeCustomerId,
                stripeSubscriptionId,
                priceId: priceId ?? undefined,
                plan: plan === "starter" ? "STARTER" : plan === "pro" ? "PRO" : plan === "agency" ? "AGENCY" : "NONE",
                status,
                currentPeriodEnd: currentPeriodEnd ?? undefined,
              },
              update: {
                priceId: priceId ?? undefined,
                plan: plan === "starter" ? "STARTER" : plan === "pro" ? "PRO" : plan === "agency" ? "AGENCY" : "NONE",
                status,
                currentPeriodEnd: currentPeriodEnd ?? undefined,
              },
            });

            // Keep latest on user as well (optional)
            await prisma.user.update({
              where: { id: user.id },
              data: {
                stripeSubscriptionId,
                plan: plan === "starter" ? "STARTER" : plan === "pro" ? "PRO" : plan === "agency" ? "AGENCY" : "NONE",
                subscriptionStatus: status,
                currentPeriodEnd: currentPeriodEnd ?? undefined,
              },
            });
          }
        }

        break;
      }

      default:
        break;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown handler error";
    return NextResponse.json({ error: `Webhook handler failed: ${message}` }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
