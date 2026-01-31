export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

type Body = {
  customerId?: string | null;
  email?: string | null;
  returnUrl?: string | null;
};

function getReturnUrl(body: Body): string {
  return (
    (body.returnUrl && body.returnUrl.trim()) ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://www.shortypro.com/dashboard"
  );
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();

    const body = (await req.json().catch(() => ({}))) as Body;

    const email = body.email?.trim() || null;
    let customerId = body.customerId?.trim() || null;

    // Find/create customer by email if customerId not supplied
    if (!customerId && email) {
      const existing = await stripe.customers.list({ email, limit: 1 });
      if (existing.data.length) customerId = existing.data[0].id;
      else customerId = (await stripe.customers.create({ email })).id;
    }

    if (!customerId) {
      return NextResponse.json(
        { error: "Missing customerId (or email to find/create customer)." },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: getReturnUrl(body),
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST" }, { status: 405 });
}
