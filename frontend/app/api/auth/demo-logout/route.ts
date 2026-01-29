import { NextResponse } from "next/server";
import { sessionCookieName } from "@/src/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/";

  const res = NextResponse.redirect(new URL(next, url.origin));
  res.cookies.set(sessionCookieName(), "", { path: "/", maxAge: 0 });
  return res;
}
