import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { planFromPriceId } from "@/src/lib/plans";
import { signSession, sessionCookieName } from "@/src/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  const next = url.searchParams.get("next") || "/portal/";

  if (!email) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, url.origin));
  }

  // Ensure user exists
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
    include: { subscriptions: { orderBy: { updatedAt: "desc" }, take: 1 } },
  });

  const sub = user.subscriptions[0];
 const plan = planFromPriceId(sub?.stripeSubscriptionId ?? null);
  const status = sub?.status ?? "none";

 const token = await signSession({ plan, status } as any);


  const res = NextResponse.redirect(new URL(next, url.origin));
 res.cookies.set(sessionCookieName, token, {

    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
