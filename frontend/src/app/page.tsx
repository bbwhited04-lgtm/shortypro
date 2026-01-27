import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            ShortyPro
          </h1>
          <p className="text-slate-300">
            Clean, modern, trustworthy. Built for fast distribution, tracking, and growth.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Open Dashboard
            </Link>
            <Link
              href="/docs"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 font-semibold hover:bg-slate-900"
            >
              Read Docs
            </Link>
          </div>
          <div className="pt-4">
            <ShareButtons title="ShortyPro" text="Check out ShortyPro:" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Fast Setup", desc: "Drop-in zip, paste files, push to Git.", href: "/docs" },
          { title: "User Dashboard", desc: "Login, profile, and share panel.", href: "/dashboard" },
          { title: "Trust & Clarity", desc: "Bio/FAQ/Docs pages that look legit.", href: "/faq" },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
            <div className="text-lg font-semibold">{c.title}</div>
            <div className="mt-2 text-sm text-slate-300">{c.desc}</div>
            <Link href={c.href} className="mt-4 inline-block text-sm">Open →</Link>
          </div>
        ))}
      </section>
    </div>
  );
}
