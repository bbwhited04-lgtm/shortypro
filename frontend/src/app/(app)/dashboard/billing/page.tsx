"use client";

import { useState } from "react";
import { Section } from "@/components/dashboard/Cards";

export default function BillingPage() {
  const [plan, setPlan] = useState<"Starter" | "Pro" | "Agency">("Pro");

const startCheckout = async () => {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });

  const { url } = await res.json();
  window.location.href = url;
};


const openPortal = async () => {
  const res = await fetch("/api/stripe/portal", { method: "POST" });
  const { url } = await res.json();
  window.location.href = url;
};

  return (
    <div className="min-h-[75vh] w-full rounded-3xl bg-zinc-950 text-zinc-100 border border-zinc-800 p-4 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
      <div className="space-y-6">
      <Section variant="dark" title="Plan" desc="Pick the plan that matches your posting volume.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            ["Starter", "For getting consistent", "10 shorts / week"],
            ["Pro", "Best for creators", "50 shorts / week"],
            ["Agency", "For teams & clients", "Unlimited-ish"],
          ].map(([name, tagline, limit]) => {
            const selected = plan === (name as any);
            return (
              <button
                key={name}
                onClick={() => setPlan(name as any)}
                className={[
                  "rounded-2xl border p-5 text-left transition",
                  selected
                    ? "border-zinc-700 bg-zinc-900 text-zinc-100"
                    : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60",
                ].join(" ")}
              >
                <div className="text-lg font-semibold">{name}</div>
                <div className={["mt-1 text-sm", selected ? "text-zinc-200" : "text-zinc-400"].join(" ")}>
                  {tagline}
                </div>
                <div className={["mt-4 text-xs", selected ? "text-zinc-300" : "text-zinc-400"].join(" ")}>
                  Included: {limit}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-2 md:flex-row">
          <button
            onClick={startCheckout}
            className="rounded-xl border border-zinc-800 bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Upgrade / Subscribe
          </button>
          <button
            onClick={openPortal}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-800"
          >
            Manage billing
          </button>
        </div>

        <div className="mt-3 text-xs text-zinc-400">
          TODO: Replace plan labels + limits with your real pricing. Wire Stripe checkout + portal.
        </div>
      </Section>

      <Section variant="dark" title="Usage" desc="Placeholder counters — swap with real metrics from your backend.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            ["Shorts generated", "18 / 50"],
            ["Exports", "12 / 50"],
            ["Scheduled", "12 / 200"],
            ["Storage", "1.2 GB / 10 GB"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-xs text-zinc-400">{k}</div>
              <div className="mt-1 text-lg font-semibold">{v}</div>
            </div>
          ))}
        </div>
      </Section>
      </div>
    </div>
  );
}
