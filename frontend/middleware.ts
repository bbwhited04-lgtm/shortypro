import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sessionCookieName, verifySession } from "./src/lib/auth";

const PROTECTED_PREFIXES = ["/portal"];

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(sessionCookieName())?.value;
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set(
      "next",
      pathname + (searchParams.toString() ? `?${searchParams}` : "")
    );
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifySession(token);
  const ok =
    session &&
    (session.status === "active" || session.status === "trialing") &&
    session.plan !== "none";

  if (!ok) {
    const upgradeUrl = new URL("/upgrade", req.url);
    upgradeUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(upgradeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};
