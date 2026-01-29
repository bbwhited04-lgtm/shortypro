import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;

  if (!token && path.startsWith("/portal")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && !token.subscription && path.startsWith("/portal")) {
    return NextResponse.redirect(new URL("/upgrade", req.url));
  }

  return NextResponse.next();
}
