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
    <div className="space-y-6">
      <Section title="Plan" desc="Pick the plan that matches your posting volume.">
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
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white hover:bg-neutral-50",
                ].join(" ")}
              >
                <div className="text-lg font-semibold">{name}</div>
                <div className={["mt-1 text-sm", selected ? "text-white/80" : "text-neutral-600"].join(" ")}>
                  {tagline}
                </div>
                <div className={["mt-4 text-xs", selected ? "text-white/70" : "text-neutral-500"].join(" ")}>
                  Included: {limit}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-2 md:flex-row">
          <button
            onClick={startCheckout}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800"
          >
            Upgrade / Subscribe
          </button>
          <button
            onClick={openPortal}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50"
          >
            Manage billing
          </button>
        </div>

        <div className="mt-3 text-xs text-neutral-500">
          TODO: Replace plan labels + limits with your real pricing. Wire Stripe checkout + portal.
        </div>
      </Section>

      <Section title="Usage" desc="Placeholder counters — swap with real metrics from your backend.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            ["Shorts generated", "18 / 50"],
            ["Exports", "12 / 50"],
            ["Scheduled", "12 / 200"],
            ["Storage", "1.2 GB / 10 GB"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="text-xs text-neutral-500">{k}</div>
              <div className="mt-1 text-lg font-semibold">{v}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
