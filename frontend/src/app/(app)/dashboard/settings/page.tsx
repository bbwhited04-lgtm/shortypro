"use client";

import { useState } from "react";
import { Section } from "@/components/dashboard/Cards";

export default function SettingsPage() {
  const [name, setName] = useState("Billy");
  const [email, setEmail] = useState("billy@deadapp.info");

  return (
    <div className="min-h-[75vh] w-full rounded-3xl bg-zinc-950 text-zinc-100 border border-zinc-800 p-4 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
      <div className="space-y-6">
      <Section variant="dark" title="Account" desc="Basic profile settings.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs text-zinc-400">Name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            />
          </div>
          <div>
            <div className="text-xs text-zinc-400">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            />
          </div>
        </div>
        <div className="mt-3 text-xs text-zinc-400">TODO: wire save to backend.</div>
      </Section>

      <Section variant="dark" title="Social connections" desc="Connect accounts so ShortyPro can post on your behalf.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            ["TikTok", true],
            ["Instagram", true],
            ["Facebook", false],
            ["YouTube", true],
          ].map(([p, connected]) => (
            <div key={p as string} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div>
                <div className="font-medium">{p as string}</div>
                <div className="mt-1 text-sm text-zinc-400">
                  {connected ? "Connected" : "Not connected"}
                </div>
              </div>
              <button className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-800">
                {connected ? "Reconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-zinc-400">TODO: wire OAuth flows.</div>
      </Section>
      </div>
    </div>
  );
}
