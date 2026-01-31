"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { PROVIDERS, ProviderCategory, ProviderId } from "@/lib/integrations/providers";

type ConnectionState = "disconnected" | "connected" | "coming_soon";

type ProviderStatus = {
  id: ProviderId;
  state: ConnectionState;
};

// MVP: local state. Replace with DB fetch later.
const DEFAULT_STATUS: ProviderStatus[] = PROVIDERS.map((p) => ({
  id: p.id,
  state: p.oauthReady ? "disconnected" : "coming_soon",
}));

const CATEGORIES: ProviderCategory[] = [
  "Social",
  "Analytics",
  "Storage",
  "Design",
  "Utilities",
  "Commerce",
  "CRM",
  "Marketing",
  "Support",
];

export default function IntegrationsPage() {
  const [status, setStatus] = useState<ProviderStatus[]>(DEFAULT_STATUS);
  const [activeCategory, setActiveCategory] = useState<ProviderCategory | "All">("All");

  const statusMap = useMemo(() => {
    const m = new Map<ProviderId, ConnectionState>();
    status.forEach((s) => m.set(s.id, s.state));
    return m;
  }, [status]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return PROVIDERS;
    return PROVIDERS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  async function connect(provider: ProviderId) {
    // this calls the backend "start oauth" route (we’ll scaffold it next)
    window.location.href = `/api/integrations/${provider}/start`;
  }

  function disconnect(provider: ProviderId) {
    // MVP: just flip UI (wire real token revoke later)
    setStatus((prev) => prev.map((s) => (s.id === provider ? { ...s, state: "disconnected" } : s)));
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-zinc-300">
          Connect tools to unify your workflows. MVP wiring: Connect / Disconnect / Status. Features come next.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className={`rounded-xl border px-3 py-2 text-sm ${
            activeCategory === "All"
              ? "border-zinc-700 bg-zinc-800/60"
              : "border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900"
          }`}
          onClick={() => setActiveCategory("All")}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`rounded-xl border px-3 py-2 text-sm ${
              activeCategory === c
                ? "border-zinc-700 bg-zinc-800/60"
                : "border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900"
            }`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => {
          const state = statusMap.get(p.id) ?? "coming_soon";
          const connected = state === "connected";
          const comingSoon = state === "coming_soon";

          return (
            <div key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="flex items-start gap-3">
                <div className="relative h-12 w-12 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                  {p.icon ? (
                    <Image src={p.icon} alt={p.name} fill className="object-contain p-2" />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-xs text-zinc-400">ICON</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-zinc-100">{p.name}</div>
                  <div className="text-xs text-zinc-500">{p.category}</div>
                </div>

                <span
                  className={`text-[11px] rounded-full border px-2 py-1 ${
                    connected
                      ? "border-emerald-700 text-emerald-300"
                      : comingSoon
                      ? "border-zinc-700 text-zinc-400"
                      : "border-blue-700 text-blue-300"
                  }`}
                >
                  {connected ? "Connected" : comingSoon ? "Coming soon" : "Ready"}
                </span>
              </div>

              <p className="mt-3 text-sm text-zinc-300">{p.description}</p>

              <div className="mt-4 flex items-center gap-2">
                {!connected ? (
                  <button
                    disabled={comingSoon}
                    onClick={() => connect(p.id)}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600"
                  >
                    Connect
                  </button>
                ) : (
                  <button
                    onClick={() => disconnect(p.id)}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-semibold hover:bg-zinc-900"
                  >
                    Disconnect
                  </button>
                )}

                <button
                  onClick={() => alert(`Learn more: ${p.name}\n\nNext: docs page per provider + required permissions.`)}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm hover:bg-zinc-900"
                >
                  Learn more ↗
                </button>
              </div>

              <div className="mt-3 text-xs text-zinc-500">
                Tip: Start with Social + Google Drive + Bitly + Slack. Then add CRM/Commerce.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
