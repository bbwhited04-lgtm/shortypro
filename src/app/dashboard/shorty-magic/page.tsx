// src/app/dashboard/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Entitlements = {
  plan?: string;
  isAdmin?: boolean;
  features?: Record<string, boolean>;
};

const FEATURE = {
  SHORTY_MAGIC: "shortyMagic",
  CHATTERLY: "chatterly",
  CALENDAR: "calendar",
  AUTPOST: "autopost",
  MAGNA: "magnahive",
} as const;

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function DashboardHome() {
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard/me", { cache: "no-store" });
        if (!res.ok) throw new Error(`me route failed: ${res.status}`);
        const data = (await res.json()) as Entitlements;
        if (alive) setEntitlements(data);
      } catch {
        if (alive) setEntitlements(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const features = useMemo(() => entitlements?.features ?? {}, [entitlements]);
  const isAdmin = !!entitlements?.isAdmin;

  const canShorty = !!features[FEATURE.SHORTY_MAGIC] || isAdmin;
  const canChat = !!features[FEATURE.CHATTERLY] || isAdmin;
  const canMagnahive = !!features[FEATURE.MAGNA] || isAdmin;
  const canCalendar = !!features[FEATURE.CALENDAR] || isAdmin;
  const canAutopost = !!features[FEATURE.AUTPOST] || isAdmin;

  const statusLabel = loading
    ? "Loading access…"
    : entitlements
    ? `Plan: ${entitlements.plan ?? "unknown"}${isAdmin ? " (admin)" : ""}`
    : "Limited mode (API not wired yet)";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            One-click tools up top. Advanced auth + scheduling below.
          </p>
        </div>

        <div className="rounded-xl border px-3 py-2 text-sm text-muted-foreground">
          {statusLabel}
        </div>
      </div>

      {/* One-click actions */}
      <section className="grid gap-4 md:grid-cols-3">
        <ActionCard
          title="Shorty Magic"
          description="Upload/link a video → generate shorts → add to calendar."
          href={canShorty ? "/shorty-magic" : "/pricing"}
          locked={!canShorty}
          icon={
            <div className="relative h-16 w-16 shrink-0">
              <Image
                src="/shortypro/shortymagic-logo.jpg"
                alt="Shorty Magic"
                fill
                priority
                className="object-contain"
              />
            </div>
          }
        />

        <ActionCard
          title="Chatterly"
          description="AI chat workspace. Instant start with one click."
          href={canChat ? "/chatterly" : "/pricing"}
          locked={!canChat}
          icon={
            <div className="relative h-16 w-16 shrink-0">
              <Image
                src="/shortypro/chatterly-logo.png"
                alt="Chatterly"
                fill
                priority
                className="object-contain"
              />
            </div>
          }
        />

        <ActionCard
          title="Magna Hive"
          description="Magnetic Funnel workspace. Instant start with one click."
          href={canMagnahive ? "/magnahive" : "/pricing"}
          locked={!canMagnahive}
          icon={
            <div className="relative h-16 w-16 shrink-0">
              <Image
                src="/shortypro/magnahive-icon.png"
                alt="Magna Hive"
                fill
                priority
                className="object-contain"
              />
            </div>
          }
        />
      </section>

      {/* Advanced tools toggle */}
      <section className="rounded-2xl border p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold">Connect & Schedule</div>
            <div className="text-sm text-muted-foreground">
              Authenticate accounts, create groups, schedule posts, and auto-post.
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-muted transition"
          >
            {advancedOpen ? "Hide" : "Open"}
          </button>
        </div>

        {advancedOpen && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <MiniTile
              title="Authenticate Accounts"
              description="Connect Facebook pages, IG, YouTube, GSC, Bing, etc."
              href="/accounts"
              locked={false}
              badge="Setup"
            />
            <MiniTile
              title="Groups"
              description="Assign connected accounts into groups for posting."
              href={canCalendar ? "/calendar/groups" : "/pricing"}
              locked={!canCalendar}
              badge={canCalendar ? "Ready" : "Locked"}
            />
            <MiniTile
              title="Calendar"
              description="Schedule content per group and manage your queue."
              href={canCalendar ? "/calendar" : "/pricing"}
              locked={!canCalendar}
              badge={canCalendar ? "Ready" : "Locked"}
            />
            <MiniTile
              title="Auto-post"
              description="Enable posting automation once accounts are connected."
              href={canAutopost ? "/calendar/autopost" : "/pricing"}
              locked={!canAutopost}
              badge={canAutopost ? "Ready" : "Locked"}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function ActionCard(props: {
  title: string;
  description: string;
  href: string;
  locked?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={props.href}
      className={classNames(
        "rounded-2xl border p-5 shadow-sm transition hover:shadow",
        props.locked && "opacity-90"
      )}
    >
      <div className="flex items-center gap-4">
        {props.icon}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold leading-tight">{props.title}</div>
            {props.locked && (
              <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                Locked
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{props.description}</div>
          <div className="mt-3 text-sm font-medium">
            {props.locked ? "Upgrade to unlock →" : "Open →"}
          </div>
        </div>
      </div>
    </Link>
  );
}

function MiniTile(props: {
  title: string;
  description: string;
  href: string;
  locked?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={props.href}
      className={classNames(
        "rounded-2xl border p-4 transition hover:bg-muted",
        props.locked && "opacity-90"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{props.title}</div>
          <div className="text-sm text-muted-foreground">{props.description}</div>
        </div>

        {props.badge && (
          <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
            {props.badge}
          </span>
        )}
      </div>

      <div className="mt-3 text-sm font-medium">
        {props.locked ? "Upgrade →" : "Open →"}
      </div>
    </Link>
  );
}
