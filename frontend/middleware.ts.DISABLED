import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/src/lib/prisma";

export const config = { matcher: ["/portal/:path*"] };

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // Not logged in → /login
  if (!token?.email) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Logged in → check subscription
  const user = await prisma.user.findUnique({
    where: { email: token.email as string },
    select: { subscriptionStatus: true, plan: true },
  });

  const active =
    user &&
    (user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing") &&
    user.plan !== "NONE";

  // Logged in but unpaid → /upgrade
  if (!active) {
    const url = new URL("/upgrade", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
