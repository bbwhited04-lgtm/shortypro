"use client";

import Link from "next/link";
import StripeBuyButton from "@/components/StripeBuyButton";

export default function DreamPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: "url(/shortypro/thedreampack-image.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80">
                THE DREAM • Own the Stack
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
                Stop paying subscriptions.
                <span className="block text-white/90">
                  Own your CRM, funnels, video & AI.
                </span>
              </h1>

              <p className="text-lg text-white/80">
                Replace the patchwork stack with one platform that creates content,
                captures leads, builds funnels, schedules posts, and keeps your customer list —
                all under one roof.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {/* Stripe Buy Button wrapper to keep your “blue glow / black pill” style */}
                <div className="inline-block rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 p-[2px]">
                  <div className="rounded-full bg-black px-5 py-2">
                    <StripeBuyButton
                      buyButtonId="buy_btn_1Svk8hKC49F2A9OzY2D3HY9o"
                      publishableKey="pk_live_51StUA4KC49F2A9Oz5PN3E29C5pUkoi4fF0IbxhaEULjdGhh5K7OGzqXc2LP78eEK1Y8sHdfZYFca0mFmGB1OBkmi00J71VEwUs"
                    />
                  </div>
                </div>

                <Link
                  href="/dream#watch"
                  className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Watch the vision
                </Link>

                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Go to dashboard
                </Link>
              </div>

              <div className="text-xs text-white/60">
                $249 / month • Cancel anytime • shortypro.com/dream
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {["CRM", "Funnels", "Video Shorts", "Scheduler", "Analytics", "Chatterly AI"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* VIDEO CARD */}
            <div
              id="watch"
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
            >
              <div className="flex items-center justify-between pb-3">
                <div className="text-sm font-semibold text-white">Watch the vision</div>
                <Link
                  href="/dream#buy"
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                  Open /dream
                </Link>
              </div>

              <div className="aspect-video overflow-hidden rounded-2xl bg-black/40">
                {/* Replace this iframe src with your actual YouTube embed url */}
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Shorty Pro The Dream Pack"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="pt-3 text-xs text-white/60">
                Pro tip: Say “Own the Stack” in every short + put <span className="text-white/80">shortypro.com/dream</span> on-screen.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-4">
          <FeatureCard
            title="CRM + Leads"
            text="Capture emails, manage contacts, export lists, and grow owned audiences."
          />
          <FeatureCard
            title="Funnels"
            text="5–10 card flash funnels with video, CTA, and email capture."
          />
          <FeatureCard
            title="Video Engine"
            text="Upload long-form video → generate shorts → schedule everywhere."
          />
          <FeatureCard
            title="Chatterly AI"
            text="Hooks, captions, scripts, replies, and CTAs on demand."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-bold">How it works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StepCard
            step="Step 1"
            title="Connect"
            text="Link your social accounts and tools in Settings → Integrations."
          />
          <StepCard
            step="Step 2"
            title="Build"
            text="Create funnels, scripts, and videos inside the dashboard."
          />
          <StepCard
            step="Step 3"
            title="Scale"
            text="Schedule posts, capture leads, and grow without extra tools."
          />
        </div>
      </section>

      {/* BUY */}
      <section id="buy" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold">The Dream Package</h3>
              <p className="mt-2 text-white/70">
                Own your CRM, funnels, video, AI, and scheduling stack.
              </p>
              <div className="mt-3 text-sm text-white/60">
                $249 / month • Cancel anytime
              </div>
            </div>

            <div className="inline-block rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 p-[2px]">
              <div className="rounded-full bg-black px-5 py-2">
                <StripeBuyButton
                  buyButtonId="buy_btn_1Svk8hKC49F2A9OzY2D3HY9o"
                  publishableKey="pk_live_51StUA4KC49F2A9Oz5PN3E29C5pUkoi4fF0IbxhaEULjdGhh5K7OGzqXc2LP78eEK1Y8sHdfZYFca0mFmGB1OBkmi00J71VEwUs"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-white/60">
            Built by DEAD APP CORP. Your audience is an asset — own it.
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-white/60">
          © {new Date().getFullYear()} DEAD APP CORP • ShortyPro
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-3 text-sm text-white/70">{text}</div>
    </div>
  );
}

function StepCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-xs text-white/60">{step}</div>
      <div className="mt-2 text-lg font-semibold">{title}</div>
      <div className="mt-3 text-sm text-white/70">{text}</div>
    </div>
  );
}
