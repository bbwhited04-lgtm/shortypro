import Link from "next/link";

export default function FunnelSlugPage({ params }: { params: { slug: string } }) {
  // v0: we don’t have DB on server yet, so we show instructions + redirect users to dashboard
  // Next step: fetch funnel by slug from DB and render it here.
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="text-sm text-white/70">Magna Hive • Funnel</div>
          <h1 className="mt-2 text-3xl font-extrabold">This funnel is not published yet</h1>
          <p className="mt-3 text-white/70">
            Funnel slug: <span className="text-white/90">{params.slug}</span>
          </p>
          <p className="mt-4 text-white/70">
            v0 funnels are stored in the browser for fast building. Next step is
            publishing from the dashboard (DB + public rendering).
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/magna-hive"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Go to Funnel Builder
            </Link>
            <Link
              href="/dream"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              See Dream
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
