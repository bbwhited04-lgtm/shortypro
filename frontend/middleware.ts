import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect everything under /portal (your backend UI)
const PROTECTED_PREFIXES = ["/portal"];

// Change this to whatever cookie name you will actually set after login/subscription check
const SESSION_COOKIE = "sp_session";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  // Allow access to assets if you later put images/css/js under /portal/shared etc.
  // (Still protected by the same rule above; if you want assets public, add exclusions here.)
  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname + (searchParams.toString() ? `?${searchParams}` : ""));
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};
