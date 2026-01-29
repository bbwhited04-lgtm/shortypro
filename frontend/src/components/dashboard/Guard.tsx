"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Quick & easy guard:
 * - If no token in localStorage, bounce to /login.
 * - Replace this later with real auth (NextAuth, Clerk, custom JWT, etc.)
 */
export function Guard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const openPaths = ["/login"];
    if (openPaths.includes(pathname)) return;

    let token = "";
    try {
      token = localStorage.getItem("shortypro_token") || "";
    } catch {}

    if (!token) router.replace("/login");
  }, [router, pathname]);

  return <>{children}</>;
}
