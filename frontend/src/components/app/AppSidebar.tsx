"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./nav";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-[320px] rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold tracking-tight text-zinc-100">ShortyPro</div>
          <div className="text-xs text-zinc-400">Dream Package Suite</div>
        </div>
        <span className="text-[11px] text-zinc-400 rounded-full border border-zinc-800 px-2 py-1">
          v0
        </span>
      </div>

      <button
        className="mt-4 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-900 transition"
        onClick={() => alert("New content flow coming next (hooks → video → funnel → schedule).")}
        type="button"
      >
        + New
      </button>

      <nav className="mt-4 space-y-2">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-2xl border px-3 py-2 text-sm transition",
                "border-zinc-800 hover:bg-zinc-800/60",
                active ? "bg-zinc-800/60 text-zinc-100" : "bg-zinc-900/40 text-zinc-300",
              ].join(" ")}
            >
              <div className="font-semibold">{item.label}</div>
              <div className="text-xs text-zinc-500">{item.href}</div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-3">
        <div className="text-xs text-zinc-400">Quick tip</div>
        <div className="text-sm text-zinc-200">
          Build: <span className="text-blue-400">Video</span> → <span className="text-blue-400">Funnel</span> →{" "}
          <span className="text-blue-400">Calendar</span>.
        </div>
      </div>
    </aside>
  );
}
