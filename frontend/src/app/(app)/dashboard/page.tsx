import Link from "next/link";

type Action = {
  href: string;
  title: string;
  subtitle: string;
  kicker: string;
  icon: React.ReactNode;
  gradient: string; // tailwind gradient classes
};

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white shadow-[0_10px_30px_rgba(0,0,0,.35)]">
      {children}
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Page() {
  const actions: Action[] = [
    {
      href: "/dashboard/videos",
      title: "Video Creator",
      subtitle: "Upload a long video → generate Shorts in minutes.",
      kicker: "Start here",
      gradient: "from-fuchsia-500/35 via-purple-500/25 to-cyan-500/25",
      icon: (
        <Icon>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
              d="M4 7.5a2.5 2.5 0 012.5-2.5h7A2.5 2.5 0 0116 7.5v9A2.5 2.5 0 0113.5 19h-7A2.5 2.5 0 014 16.5v-9z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M16 9l4-2v10l-4-2V9z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </Icon>
      ),
    },
    {
      href: "/dashboard/magna-hive",
      title: "Magna Hive Funnels",
      subtitle: "Pick a template → edit copy → publish a clean share link.",
      kicker: "Build funnels",
      gradient: "from-amber-400/30 via-orange-500/20 to-rose-500/20",
      icon: (
        <Icon>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
              d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11A2.5 2.5 0 0117.5 20h-11A2.5 2.5 0 014 17.5v-11z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M8 9h8M8 12h6M8 15h7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Icon>
      ),
    },
    {
      href: "/dashboard/scheduler",
      title: "Scheduler",
      subtitle: "Plan posts across platforms. Queue, preview, publish.",
      kicker: "Schedule & post",
      gradient: "from-emerald-400/25 via-teal-500/20 to-sky-500/20",
      icon: (
        <Icon>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
              d="M7 3v3M17 3v3M4 8h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M6 6h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 12v4l3 2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Icon>
      ),
    },
    {
      href: "/dashboard/chatterly",
      title: "Chatterly AI",
      subtitle: "Hooks, captions, scripts, replies, CTAs — fast.",
      kicker: "Write smarter",
      gradient: "from-zinc-200/10 via-purple-500/15 to-fuchsia-500/15",
      icon: (
        <Icon>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
              d="M20 12a7 7 0 01-7 7H7l-3 3v-6a7 7 0 010-8 7 7 0 017-3 7 7 0 017 7z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M8 11h8M8 14h6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Icon>
      ),
    },
    {
      href: "/dashboard/analytics",
      title: "Analytics",
      subtitle: "Track growth, posts, funnels, and leads in one snapshot.",
      kicker: "Measure results",
      gradient: "from-sky-500/20 via-indigo-500/18 to-violet-500/20",
      icon: (
        <Icon>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
              d="M4 19V5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 19v-6M12 19v-9M16 19v-4M20 19V8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Icon>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Dark workspace panel (matches Chatterly look) */}
      <div className="w-full rounded-3xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold tracking-wide text-zinc-400">
                DASHBOARD OVERVIEW
              </div>
              <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">
                Own the Stack
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-zinc-300">
                Tip: Start in{" "}
                <Link href="/dashboard/videos" className="underline decoration-zinc-600 underline-offset-4 hover:decoration-zinc-300">
                  Videos
                </Link>{" "}
                to upload & generate shorts. Then publish a funnel in{" "}
                <Link href="/dashboard/magna-hive" className="underline decoration-zinc-600 underline-offset-4 hover:decoration-zinc-300">
                  Magna Hive
                </Link>{" "}
                and schedule posts.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/settings"
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-100 hover:bg-white/10"
              >
                Connect accounts
              </Link>
              <Link
                href="/dashboard/billing"
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-100 hover:bg-white/10"
              >
                Billing
              </Link>
              <Link
                href="/index.html"
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-100 hover:bg-white/10"
              >
                View site
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              { label: "Scheduled Posts", value: "—", hint: "From Scheduler" },
              { label: "Leads Captured", value: "—", hint: "From Funnels/CRM" },
              { label: "Active Funnels", value: "—", hint: "From Magna Hive" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-200">
                    {s.label}
                  </div>
                  <div className="text-[11px] font-semibold text-zinc-500">
                    {s.hint}
                  </div>
                </div>
                <div className="mt-2 text-3xl font-black tracking-tight text-white">
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Big buttons */}
          <div className="mt-5">
            <div className="mb-2 text-xs font-semibold tracking-wide text-zinc-400">
              QUICK START
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {actions.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  <div
                    className={[
                      "pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100",
                      "bg-gradient-to-br",
                      a.gradient,
                    ].join(" ")}
                  />
                  <div className="relative flex items-start gap-4">
                    {a.icon}
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                        <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1">
                          {a.kicker}
                        </span>
                      </div>
                      <div className="mt-2 text-lg font-black tracking-tight text-white">
                        {a.title}
                      </div>
                      <div className="mt-1 text-sm text-zinc-300">
                        {a.subtitle}
                      </div>
                    </div>

                    <div className="ml-auto mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-zinc-200 transition group-hover:bg-black/40">
                      <Arrow />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm font-bold text-zinc-200">Suggested flow</div>
              <div className="mt-1 text-sm text-zinc-300">
                Videos → Magna Hive → Scheduler → Analytics. Use Chatterly for hooks, captions, and replies.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Light helper panel (matches overall layout) */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-bold text-neutral-900">Need help?</div>
        <p className="mt-1 text-sm text-neutral-600">
          Check <Link className="underline" href="/dashboard/help">Help</Link> for walkthroughs and quick fixes.
        </p>
      </div>
    </div>
  );
}
