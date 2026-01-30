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
      {/* Premium hero header */}
      <section className="relative overflow-hidden rounded-3xl border p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-fuchsia-500/5 to-cyan-500/10" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Your content engine is ready.
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              One click to create. One place to schedule. Everything stays simple.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground bg-background/60">
              {statusLabel}
            </span>
            <span className="rounded-full border px-3 py-1 text-xs font-medium bg-background/60">
              {loading ? "Syncing…" : "Online"}
            </span>
          </div>
        </div>
      </section>

      {/* One-click actions */}
      <section className="grid gap-4 md:grid-cols-3">
        <ActionCard
          title="Shorty Magic"
          description="Turn any video into a batch of shorts in minutes."
          href={canShorty ? "/dashboard/shorty-magic" : "/pricing"}
          locked={!canShorty}
          variant="primary"
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
          description="AI chat workspace for ideas, captions, hooks, and replies."
          href={canChat ? "/dashboard/chatterly" : "/pricing"}
          locked={!canChat}
          variant="secondary"
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
          description="Build magnetic funnels and turn attention into action."
          href={canMagnahive ? "/dashboard/magnahive" : "/pricing"}
          locked={!canMagnahive}
          variant="secondary"
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

      {/* Advanced tools */}
      <section className="rounded-3xl border p-5 md:p-6">
        <button
          type="button"
          onClick={() => setAdvancedOpen((v) => !v)}
          className="w-full flex items-center justify-between rounded-2xl border px-4 py-3 hover:bg-muted transition"
        >
          <div className="text-left">
            <div className="text-base font-semibold">Connect & Schedule</div>
            <div className="text-sm text-muted-foreground">
              Authenticate accounts, create groups, schedule posts, and auto-post.
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {advancedOpen ? "▲" : "▼"}
          </span>
        </button>

        {advancedOpen && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <MiniTile
              title="Authenticate Accounts"
              description="Connect Facebook pages, IG, YouTube, GSC, Bing, etc."
              href="/dashboard/accounts"
              locked={false}
              badge="Setup"
            />
            <MiniTile
              title="Groups"
              description="Assign connected accounts into groups for posting."
              href={canCalendar ? "/dashboard/calendar/groups" : "/pricing"}
              locked={!canCalendar}
              badge={canCalendar ? "Ready" : "Locked"}
            />
            <MiniTile
              title="Calendar"
              description="Schedule content per group and manage your queue."
              href={canCalendar ? "/dashboard/calendar" : "/pricing"}
              locked={!canCalendar}
              badge={canCalendar ? "Ready" : "Locked"}
            />
            <MiniTile
              title="Auto-post"
              description="Enable posting automation once accounts are connected."
              href={canAutopost ? "/dashboard/calendar/autopost" : "/pricing"}
              locked={!canAutopost}
              badge={canAutopost ? "Ready" : "Locked"}
            />
          </div>
        )}
      </section>
    </div>
  );


function ActionCard(props: {
  title: string;
  description: string;
  href: string;
  locked?: boolean;
  icon: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = props.variant === "primary";

  return (
    <Link
      href={props.href}
      className={classNames(
        "group relative rounded-3xl border p-6 shadow-sm transition",
        "hover:-translate-y-0.5 hover:shadow-md",
        isPrimary && "bg-gradient-to-br from-purple-600/10 via-fuchsia-500/5 to-cyan-500/10",
        props.locked && "opacity-90"
      )}
    >
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />

      <div className="relative flex items-center gap-4">
        {props.icon}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold leading-tight">{props.title}</div>

            {props.locked ? (
              <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground bg-background/60">
                Locked
              </span>
            ) : isPrimary ? (
              <span className="rounded-full border px-2 py-0.5 text-xs font-medium bg-background/60">
                Recommended
              </span>
            ) : null}
          </div>

          <div className="mt-1 text-sm text-muted-foreground">{props.description}</div>

          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
            {props.locked ? "Upgrade to unlock" : "Open"}
            <span className="transition group-hover:translate-x-0.5">→</span>
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
