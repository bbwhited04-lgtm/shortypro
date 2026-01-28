"use client";

import { useMemo, useState } from "react";

function apiBase() {
  return (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");
}

async function postJson<T>(path: string, body?: any): Promise<T> {
  const base = apiBase();
  const url = base ? `${base}${path}` : path;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : "{}",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.detail || `Request failed (${res.status})`);
  }
  return data as T;
}

export default function Home() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cards = useMemo(() => ([
    {
      title: "Start using Shorty Pro",
      desc: "Create, schedule, and publish content across platforms — clean and fast.",
      cta: "Go to Stripe Checkout",
      action: async () => {
        type Out = { url: string };
        const out = await postJson<Out>("/stripe/create-checkout-session");
        window.location.href = out.url;
      }
    },
    {
      title: "Customer Portal",
      desc: "Manage billing. Requires a Stripe customer_id (wire via webhook later).",
      cta: "Open Portal (demo)",
      action: async () => {
        const customer_id = prompt("Enter Stripe customer_id (cus_...):") || "";
        if (!customer_id) return;
        type Out = { url: string };
        const out = await postJson<Out>("/stripe/create-portal-session?customer_id=" + encodeURIComponent(customer_id));
        window.location.href = out.url;
      }
    },
    {
      title: "API Health",
      desc: "Quick check that the backend is alive on Render.",
      cta: "Ping /health",
      action: async () => {
        const base = apiBase();
        const url = base ? `${base}/health` : "/health";
        const res = await fetch(url);
        const json = await res.json();
        alert("Backend OK: " + JSON.stringify(json));
      }
    }
  ]), []);

  async function run(action: () => Promise<void>) {
    setError(null);
    setBusy(true);
    try {
      await action();
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen">
      <header className="mx-auto max-w-5xl px-6 pt-10 pb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Shorty Pro</h1>
            <p className="text-slate-300 mt-2 max-w-2xl">
              Clean, modern, trustworthy — built to turn short-form into predictable growth.
            </p>
          </div>
          <nav className="flex gap-3 text-sm text-slate-300">
            <a className="hover:text-white" href="https://x.com/shortypro2" target="_blank" rel="noreferrer">X</a>
            <a className="hover:text-white" href="https://www.threads.com/@shortypro2" target="_blank" rel="noreferrer">Threads</a>
            <a className="hover:text-white" href="https://www.tiktok.com/@shortypro2" target="_blank" rel="noreferrer">TikTok</a>
            <a className="hover:text-white" href="https://www.youtube.com/channel/UCmbX7LCkJK_8YmuRwUKfKGQ" target="_blank" rel="noreferrer">YouTube</a>
            <a className="hover:text-white" href="https://www.facebook.com/profile.php?id=61587277436466" target="_blank" rel="noreferrer">Facebook</a>
            <a className="hover:text-white" href="https://www.instagram.com/shortypro2" target="_blank" rel="noreferrer">Instagram</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-100">
            <div className="font-medium">Error</div>
            <div className="text-sm opacity-90 mt-1">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.title} className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
              {/* No overlay div here (overlays often block clicks). */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{c.title}</h2>
                  <p className="mt-2 text-sm text-slate-300">{c.desc}</p>
                </div>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => run(c.action)}
                  disabled={busy}
                  className="relative z-10 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {busy ? "Working…" : c.cta}
                </button>
              </div>

              {/* Decorative gradient, pointer-events disabled so it NEVER blocks buttons */}
              <div
                aria-hidden
                data-click-shield="true"
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 text-xs text-slate-400">
          <p>
            Tip: Set <code className="rounded bg-white/10 px-1 py-0.5">NEXT_PUBLIC_API_BASE</code> on Vercel to your Render backend URL.
          </p>
        </div>
      </section>
    </main>
  );
}
