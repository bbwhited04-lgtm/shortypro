"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { PROVIDERS } from "@/lib/integrations/providers";

type ConnectionState = "disconnected" | "connected" | "coming_soon";

export default function SettingsIntegrations() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set(PROVIDERS.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PROVIDERS.filter((p) => {
      const catOk = category === "All" || p.category === category;
      const qOk =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query);
      return catOk && qOk;
    });
  }, [q, category]);

  function connect(providerId: string) {
    // Universal router you generated
    window.location.href = `/api/integrations/${providerId}/start`;
  }

  function learn(providerName: string) {
    alert(`Docs coming soon for ${providerName}.`);
  }

  // MVP status: if oauthReady in registry mark "Ready" otherwise "Coming soon"
  function stateFor(p: any): ConnectionState {
    return p.oauthReady ? "disconnected" : "coming_soon";
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Integrations</h2>
        <p className="text-zinc-300">
          Connect additional tools to unify your workflows and provide a seamless customer experience.
        </p>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search integrations…"
            className="w-full md:w-[320px] rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-zinc-500">
          Tip: start with Slack + Google Drive + Bitly + Google Analytics.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => {
          const state = stateFor(p);
          const comingSoon = state === "coming_soon";

          return (
            <div key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
              <div className="h-[84px] grid place-items-center border-b border-zinc-800 bg-zinc-900/30">
                <div className="relative h-12 w-12">
                  {p.icon ? (
                    <Image src={p.icon} alt={p.name} fill className="object-contain" />
                  ) : (
                    <div className="h-12 w-12 rounded-xl border border-zinc-800 bg-zinc-950 grid place-items-center text-[10px] text-zinc-400">
                      {p.name.slice(0, 4).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-zinc-100">{p.name}</div>
                    <div className="text-xs text-zinc-500">{p.category}</div>
                  </div>

                  <span
                    className={[
                      "text-[11px] rounded-full border px-2 py-1",
                      comingSoon ? "border-zinc-700 text-zinc-400" : "border-blue-700 text-blue-300",
                    ].join(" ")}
                  >
                    {comingSoon ? "Coming soon" : "Ready"}
                  </span>
                </div>

                <p className="mt-3 text-sm text-zinc-300">{p.description}</p>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => connect(p.id)}
                    disabled={comingSoon}
                    className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600"
                  >
                    Connect
                  </button>

                  <button
                    onClick={() => learn(p.name)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm hover:bg-zinc-900"
                  >
                    Learn more ↗
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
