import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: "url(/shortypro/thedreampack-image.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />

        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
              THE DREAM • Own the stack
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              Stop paying subscriptions.
              <span className="block text-white/90">Own your CRM + Funnels + Video + AI.</span>
            </h1>

            <p className="text-lg text-white/80">
              The Dream Package is the all-in-one stack: lead capture, funnel builder, content tools,
              auto-post scheduler, analytics, and Chatterly AI — built to scale.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* ✅ Replace href with Stripe Payment Link or your /checkout route */}
              <a
                href="#buy"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
              >
                Get Dream Package
              </a>

              <Link
                href="/login"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Log in
              </Link>
            </div>

            <div className="text-xs text-white/60">
              $249 Dream Package • Cancel anytime • Built for creators & small teams
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold">What you get</h2>
        <p className="mt-2 text-white/70">A complete stack to create, capture, and convert.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "CRM + Leads", desc: "Capture leads, segment lists, export for bulk email." },
            { title: "Funnels", desc: "5–10 flash-card funnels with CTA, video, email capture." },
            { title: "Video Shorts", desc: "Upload a long video → generate shorts → schedule posts." },
            { title: "Chatterly AI", desc: "Hooks, captions, scripts, replies, CTAs — on demand." },
          ].map((x) => (
            <div key={x.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold">{x.title}</div>
              <div className="mt-2 text-sm text-white/70">{x.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-bold">How it works</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { step: "1", title: "Connect accounts", desc: "Link social + tools in Settings → Integrations." },
            { step: "2", title: "Build your funnel", desc: "Create a 5–10 card funnel and capture emails." },
            { step: "3", title: "Create & schedule", desc: "Generate shorts + captions and auto-post everywhere." },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-white/10 bg-white/5 p-6">
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
                Own your stack: CRM + Funnels + Video + AI + Scheduling + Analytics.
              </p>
              <div className="mt-3 text-sm text-white/60">Subscription: $249/month</div>
            </div>

            {/* ✅ Swap this button to Stripe Payment Link or Checkout Session */}
            <a
              href="/api/stripe/dream" // or your Stripe Payment Link URL
              className="inline-flex items-center justify-center rounded-xl bg-fuchsia-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fuchsia-400"
            >
              Buy now
            </a>
          </div>

          {/* Video placeholder */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 text-white/70">
            <div className="font-semibold text-white">Watch the full walkthrough (YouTube)</div>
            <div className="mt-2 text-sm">
              Drop your YouTube video ID here when it’s uploaded and we’ll embed it cleanly.
            </div>
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
