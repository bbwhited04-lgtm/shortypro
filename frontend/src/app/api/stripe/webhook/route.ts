import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { planFromPriceId } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function toPlanEnum(plan: string | null | undefined) {
  // Adjust these to match your Prisma enum EXACTLY
  switch ((plan ?? "").toLowerCase()) {
    case "starter":
      return "STARTER";
    case "pro":
      return "PRO";
    case "agency":
      return "AGENCY";
    case "dream":
    case "own_the_stack":
    case "own-the-stack":
      return "DREAM"; // if you have it; otherwise change to "PRO" or "AGENCY"
    default:
      return "NONE";
  }
}

function getCustomerId(obj: any): string | null {
  const c = obj?.customer;
  if (typeof c === "string") return c;
  if (c && typeof c.id === "string") return c.id;
  return null;
}

function getEmailFromCheckoutSession(session: any): string | null {
  return (
    session?.customer_details?.email ??
    session?.customer_email ??
    session?.customer_details?.email_address ??
    null
  );
}

function getPriceIdFromSubscription(sub: any): string | null {
  return sub?.items?.data?.[0]?.price?.id ?? null;
}

function getCurrentPeriodEnd(sub: any): Date | null {
  // Stripe sends timestamps in seconds. Typings may vary, so use safe access.
  const cpe = (sub as any)?.current_period_end;
  return typeof cpe === "number" ? new Date(cpe * 1000) : null;
}

async function upsertUserByEmail(email: string, stripeCustomerId?: string | null) {
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, ...(stripeCustomerId ? { stripeCustomerId } : {}) },
    update: stripeCustomerId ? { stripeCustomerId } : {},
  });
  return user;
}

async function upsertSubscriptionForCustomer(
  stripeCustomerId: string,
  sub: any,
  fallbackEmail?: string | null
) {
  const stripeSubscriptionId = sub?.id as string | undefined;
  if (!stripeSubscriptionId) return;

  const priceId = getPriceIdFromSubscription(sub);
  const plan = planFromPriceId(priceId);
  const planEnum = toPlanEnum(plan);
  const status = (sub?.status ?? "none") as string;
  const currentPeriodEnd = getCurrentPeriodEnd(sub);

  // Find user by customer id. If not found but we have an email (from checkout), create/link it.
  let user = await prisma.user.findFirst({ where: { stripeCustomerId } });

  if (!user && fallbackEmail) {
    user = await upsertUserByEmail(fallbackEmail, stripeCustomerId);
  }

  if (!user) return;

  // Subscription table (if you have it)
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId },
    create: {
      userId: user.id,
      stripeCustomerId,
      stripeSubscriptionId,
      ...(priceId ? { priceId } : {}),
      plan: planEnum,
      status,
      ...(currentPeriodEnd ? { currentPeriodEnd } : {}),
    },
    update: {
      ...(priceId ? { priceId } : {}),
      plan: planEnum,
      status,
      ...(currentPeriodEnd ? { currentPeriodEnd } : {}),
    },
  });

  // Keep latest on user (optional)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeSubscriptionId,
      plan: planEnum,
      subscriptionStatus: status,
      ...(currentPeriodEnd ? { currentPeriodEnd } : {}),
    },
  });
}

async function clearSubscriptionForCustomer(stripeCustomerId: string, stripeSubscriptionId?: string) {
  // If you want to mark user unsubscribed on deletion:
  const user = await prisma.user.findFirst({ where: { stripeCustomerId } });
  if (!user) return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: "canceled",
      plan: "NONE",
      ...(stripeSubscriptionId ? { stripeSubscriptionId: null } : {}),
      currentPeriodEnd: null,
    } as any,
  });
}

export async function POST(req: Request) {
  try {
    const webhookSecret = requireEnv("STRIPE_WEBHOOK_SECRET");
    const sig = headers().get("stripe-signature");
    if (!sig) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const body = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err?.message ?? "unknown error"}` },
        { status: 400 }
      );
    }

    // Handle events
    switch (event.type) {
      /**
       * If you use Checkout Sessions (recommended), this fires right after payment.
       * It may include customer + subscription id.
       */
      case "checkout.session.completed": {
        const session = event.data.object as any;

        const email = getEmailFromCheckoutSession(session);
        const stripeCustomerId = getCustomerId(session);

        // Link user to customer id ASAP
        if (email) {
          await upsertUserByEmail(email, stripeCustomerId);
        }

        // If session includes subscription, retrieve it and persist plan/status
        const subId = session?.subscription;
        if (subId && typeof subId === "string") {
          const sub = await stripe.subscriptions.retrieve(subId);
          const customerId = getCustomerId(sub) ?? stripeCustomerId;
          if (customerId) {
            await upsertSubscriptionForCustomer(customerId, sub as any, email);
          }
        }

        break;
      }

      /**
       * Subscription lifecycle events
       */
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as any;
        const stripeCustomerId = getCustomerId(sub);
        if (stripeCustomerId) {
          await upsertSubscriptionForCustomer(stripeCustomerId, sub);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const stripeCustomerId = getCustomerId(sub);
        if (stripeCustomerId) {
          await clearSubscriptionForCustomer(stripeCustomerId, sub?.id);
        }
        break;
      }

      /**
       * Optional: invoice success can be helpful if you want “paid = active”
       */
      case "invoice.payment_succeeded": {
        // no-op for now, but can be used later for renewal logic
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: err?.message ?? "Webhook handler failed" }, { status: 500 });
  }
}
