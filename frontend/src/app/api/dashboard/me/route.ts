// src/app/api/dashboard/me/route.ts
import { NextResponse } from "next/server";

// 🔑 ADMIN OVERRIDE EMAILS
const ADMIN_EMAILS = ["bbwhited@icloud.com"];

export async function GET() {
  /**
   * TODO (later):
   * - Replace this stub with real auth (Supabase / NextAuth / Clerk)
   * - Pull user email from session
   * - Map Stripe price_id → plan → features
   */

  // ✅ TEMP: hardcoded user for now
  const userEmail = "bbwhited@icloud.com";

  const isAdmin = ADMIN_EMAILS.includes(userEmail);

  // 🎛 Feature flags
  const features = {
    shortyMagic: true,
    chatterly: true,
    magnahive: true,
    calendar: true,
    autopost: false, // keep off until ready
  };

  return NextResponse.json({
    plan: isAdmin ? "admin" : "free",
    isAdmin,
    features,
  });
}
