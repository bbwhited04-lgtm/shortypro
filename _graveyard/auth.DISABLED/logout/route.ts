import { NextResponse } from "next/server";
import { ENV } from "@/lib/env";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ENV.AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
