"use client";
import Link from "next/link";
import DreamBuyButton from "@/components/DreamBuyButton";

export default function DreamPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: "url(/shortypro/thedreampack-image.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black" />

        <div className="relative mx-auto max-w-6xl px-6 py-28">
          <div className="max-w-2xl space-y-6">
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
              The Dream Package replaces Salesforce, Canva, Sprout, funnel builders,
              schedulers, and AI tools with one platform you control.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
             <script async src="https://js.stripe.com/v3/buy-button.js">
             </script>

            <stripe-buy-button buy-button-id="buy_btn_1Svk8hKC49F2A9OzY2D3HY9o" publishable-key="pk_live_51StUA4KC49F2A9Oz5PN3E29C5pUkoi4fF0IbxhaEULjdGhh5K7OGzqXc2LP78eEK1Y8sHdfZYFca0mFmGB1OBkmi00J71VEwUs">
            </stripe-buy-button>


              <Link
                href="/login"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Log in
              </Link>
            </div>

            <div className="text-xs text-white/60">
              $249 Dream Package • Cancel anytime • shortypro.com
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold">Watch the vision</h2>
        <p className="mt-2 text-white/70">
          One platform. One stack. No more subscriptions.
        </p>

        <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
          <iframe
            className="h-full w-full"
            src="https://www.youtube-nocookie.com/embed/_TBNaGEfgwA"
            title="The Dream Package – ShortyPro"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-2xl font-bold">What’s included</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "CRM + Leads",
              desc: "Capture emails, manage contacts, export lists, and grow owned audiences.",
            },
            {
              title: "Funnels",
              desc: "5–10 card flash funnels with video, CTA, and email capture.",
            },
            {
              title: "Video Engine",
              desc: "Upload long-form video → generate shorts → schedule everywhere.",
            },
            {
              title: "Chatterly AI",
              desc: "Hooks, captions, scripts, replies, and CTAs on demand.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="font-semibold">{item.title}</div>
              <div className="mt-2 text-sm text-white/70">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-2xl font-bold">How it works</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Connect",
              desc: "Link your social accounts and tools in Settings → Integrations.",
            },
            {
              step: "2",
              title: "Build",
              desc: "Create funnels, scripts, and videos inside the dashboard.",
            },
            {
              step: "3",
              title: "Scale",
              desc: "Schedule posts, capture leads, and grow without extra tools.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-xs text-white/60">Step {s.step}</div>
              <div className="mt-1 font-semibold">{s.title}</div>
              <div className="mt-2 text-sm text-white/70">{s.desc}</div>
            </div>
          ))}
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
              <script async src="https://js.stripe.com/v3/buy-button.js">
              </script>
              <stripe-buy-button buy-button-id="buy_btn_1Svk8hKC49F2A9OzY2D3HY9o" publishable-key="pk_live_51StUA4KC49F2A9Oz5PN3E29C5pUkoi4fF0IbxhaEULjdGhh5K7OGzqXc2LP78eEK1Y8sHdfZYFca0mFmGB1OBkmi00J71VEwUs">
              </stripe-buy-button>
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
