import Link from "next/link";

const tiles = [
  {
    title: "Video Creator",
    desc: "Upload a long video → generate shorts → export.",
    href: "/dashboard/videos",
    tag: "Shorty Magic",
  },
  {
    title: "Funnel Generator",
    desc: "Build a simple 5–10 card funnel that captures leads.",
    href: "/dashboard/magna-hive",
    tag: "Magna Hive",
  },
  {
    title: "Posting Calendar",
    desc: "Schedule content across connected accounts.",
    href: "/dashboard/scheduler",
    tag: "Chatterly",
  },
  {
    title: "Analytics",
    desc: "Track posts, growth, and what’s working.",
    href: "/dashboard/analytics",
    tag: "Numbers",
  },
  {
    title: "Settings",
    desc: "Connect platforms, manage profile, and billing.",
    href: "/dashboard/settings",
    tag: "Integrations",
  },
] as const;

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-2 py-1 text-[11px] font-semibold text-neutral-700">
      {children}
    </span>
  );
}

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Pick a starting lane. The whole platform is built around five big moves — create, funnel, schedule, analyze,
          connect.
        </p>
      </div>

      {/* Big Button Theory */}
      <div className="grid gap-4 md:grid-cols-5">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-base font-semibold text-neutral-900">{t.title}</div>
                  <div className="text-xs text-neutral-600">{t.desc}</div>
                </div>
                <Tag>{t.tag}</Tag>
              </div>
              <div className="pt-1 text-sm font-semibold text-neutral-900 group-hover:underline">Open →</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Helpers */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Today</div>
          <div className="mt-1 text-xs text-neutral-600">Quick snapshot (placeholder until metrics wiring is complete).</div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-neutral-50 p-3">
              <div className="text-xs text-neutral-500">Scheduled</div>
              <div className="mt-1 text-lg font-bold text-neutral-900">—</div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3">
              <div className="text-xs text-neutral-500">Leads</div>
              <div className="mt-1 text-lg font-bold text-neutral-900">—</div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3">
              <div className="text-xs text-neutral-500">Funnels</div>
              <div className="mt-1 text-lg font-bold text-neutral-900">—</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Next best action</div>
          <p className="mt-1 text-sm text-neutral-600">
            If you’re new: start in Videos → generate 3 shorts → schedule them in Calendar.
          </p>
          <Link
            href="/dashboard/videos"
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Go to Videos
          </Link>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Big button theory</div>
          <p className="mt-1 text-sm text-neutral-600">Keep it simple: five lanes, minimal clicks, clear outcomes.</p>
          <div className="mt-4 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-700">
            We’ll wire real metrics + cross-links next: Videos → Funnel → Calendar → Analytics.
          </div>
        </div>
      </div>
    </div>
  );
}
