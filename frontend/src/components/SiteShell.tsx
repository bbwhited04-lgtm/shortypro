import Link from "next/link";
import { ENV } from "@/lib/env";
import SocialLinks from "./SocialLinks";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-800/60 bg-slate-950/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-400 text-slate-950 font-black">
              SP
            </span>
            <span className="font-semibold tracking-tight">{ENV.APP_NAME}</span>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link href="/docs">Docs</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/bio">Bio</Link>
            <Link href="/dashboard" className="rounded-lg bg-slate-800/60 px-3 py-1 hover:bg-slate-700/60">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

      <footer className="border-t border-slate-800/60">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-300">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="font-semibold text-slate-100">{ENV.APP_NAME}</div>
              <div className="text-slate-400">
                Clean, modern, trustworthy. Built to ship.
              </div>
              {ENV.CROSSLINKS.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {ENV.CROSSLINKS.map((u) => (
                    <a key={u} href={u} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">
                      {u.replace(/^https?:\/\//, "")}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <SocialLinks />
          </div>

          <div className="mt-6 text-xs text-slate-500">
            © {new Date().getFullYear()} {ENV.APP_NAME}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
