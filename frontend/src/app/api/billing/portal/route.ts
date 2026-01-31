export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

type Body = {
  // Preferred: known Stripe customer id (cus_...)
  customerId?: string | null;

  // Fallback: use email to look up/create customer
  email?: string | null;

  // Where to send user back after managing billing
  returnUrl?: string | null;
};

function getReturnUrl(body: Body): string {
  // Allow caller override; otherwise default to your site
  return (
    (body.returnUrl && body.returnUrl.trim()) ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://www.shortypro.com"
  );
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();

    const body = (await req.json().catch(() => ({}))) as Body;

    const email = body.email?.trim() || null;
    let customerId = body.customerId?.trim() || null;

    // If no customerId, try to find an existing customer by email.
    if (!customerId && email) {
      const existing = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (existing.data.length > 0) {
        customerId = existing.data[0].id;
      } else {
        // Create a customer if none exists
        const created = await stripe.customers.create({ email });
        customerId = created.id;
      }
    }

    if (!customerId) {
      return NextResponse.json(
        { error: "Missing customerId (or email to create/find customer)." },
        { status: 400 }
      );
    }

    const returnUrl = getReturnUrl(body);

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    // Helpful error output without crashing build
    return NextResponse.json(
      {
        error: "Failed to create billing portal session",
        message: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}

// Optional: reject other methods cleanly
export async function GET() {
  return NextResponse.json({ error: "Use POST" }, { status: 405 });
}
