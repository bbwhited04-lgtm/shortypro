"use client";

import { useState } from "react";
import { Section } from "@/components/dashboard/Cards";

export default function SettingsPage() {
  const [name, setName] = useState("Billy");
  const [email, setEmail] = useState("billy@deadapp.info");

  return (
    <div className="space-y-6">
      <Section title="Account" desc="Basic profile settings.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs text-neutral-500">Name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
          <div>
            <div className="text-xs text-neutral-500">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
        </div>
        <div className="mt-3 text-xs text-neutral-500">TODO: wire save to backend.</div>
      </Section>

      <Section title="Social connections" desc="Connect accounts so ShortyPro can post on your behalf.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            ["TikTok", true],
            ["Instagram", true],
            ["Facebook", false],
            ["YouTube", true],
          ].map(([p, connected]) => (
            <div key={p as string} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
              <div>
                <div className="font-medium">{p as string}</div>
                <div className="mt-1 text-sm text-neutral-600">
                  {connected ? "Connected" : "Not connected"}
                </div>
              </div>
              <button className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800">
                {connected ? "Reconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-neutral-500">TODO: wire OAuth flows.</div>
      </Section>
    </div>
  );
}
