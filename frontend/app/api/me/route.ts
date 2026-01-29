import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { planFromPriceId } from "@/src/lib/plans";
import { sessionCookieName, verifySession, signSession } from "@/src/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = (req.headers.get("cookie") || "")
    .split(";")
    .map((s) => s.trim())
    .find((c) => c.startsWith(sessionCookieName() + "="))
    ?.split("=")[1];

  if (!token) return NextResponse.json({ authenticated: false }, { status: 200 });

  const session = await verifySession(decodeURIComponent(token));
  if (!session?.sub) return NextResponse.json({ authenticated: false }, { status: 200 });

  const user = await prisma.user.findUnique({
    where: { email: session.sub },
    include: { subscriptions: { orderBy: { updatedAt: "desc" }, take: 1 } },
  });

  const sub = user?.subscriptions[0];
  const plan = planFromPriceId(sub?.stripePriceId ?? null);
  const status = sub?.status ?? "none";

  // refresh token with latest plan/status
  const refreshed = await signSession({ sub: session.sub, plan, status });

  const res = NextResponse.json({
    authenticated: true,
    email: session.sub,
    plan,
    status,
    stripeCustomerId: user?.stripeCustomerId ?? null,
  });

  res.headers.set(
    "Set-Cookie",
    `${sessionCookieName()}=${encodeURIComponent(refreshed)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 14}`
  );
  return res;
}
