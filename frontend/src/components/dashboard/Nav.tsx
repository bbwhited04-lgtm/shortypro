"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/videos", label: "Videos" },
  { href: "/dashboard/scheduler", label: "Scheduler" },
  { href: "/dashboard/assets", label: "Assets" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/chatterly", label: "Chatterly" },
  { href: "/dashboard/magna-hive", label: "Magna Hive" },
  { href: "/dashboard/help", label: "Help" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="mt-6 flex flex-col gap-1">
      <Link
        href="/index.html"
        className="rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
      >
        Home (sales page)
      </Link>
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={[
              "rounded-xl px-3 py-2 text-sm transition",
              active
                ? "bg-neutral-900 text-white"
                : "text-neutral-700 hover:bg-neutral-100",
            ].join(" ")}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
