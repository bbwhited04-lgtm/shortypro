"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Step = {
  id: string;
  title: string;
  copy: string;
};

export default function MagnaHivePage() {
  const [name, setName] = useState("New Funnel");
  const [audience, setAudience] = useState("");
  const [offer, setOffer] = useState("");
  const [steps, setSteps] = useState<Step[]>([
    { id: crypto.randomUUID(), title: "Landing Page", copy: "" },
    { id: crypto.randomUUID(), title: "Opt-In", copy: "" },
    { id: crypto.randomUUID(), title: "Thank You Page", copy: "" },
    { id: crypto.randomUUID(), title: "Follow-Up Messages", copy: "" },
  ]);

  const ready = useMemo(() => audience.trim() && offer.trim(), [audience, offer]);

  function updateStep(id: string, patch: Partial<Step>) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function generateCopy() {
    if (!ready) return;

    const base = `Audience: ${audience}\nOffer: ${offer}\n\n`;

    setSteps((prev) =>
      prev.map((s) => ({
        ...s,
        copy:
          base +
          `=== ${s.title} ===\n` +
          `Headline: ${offer} for ${audience}\n` +
          `Body: Here’s a simple, clear message explaining why this matters and what to do next.\n` +
          `CTA: Get started →\n`,
      }))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0">
          <Image
            src="/shortypro/magnahive-icon.png"
            alt="Magna Hive"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Magna Hive</h1>
          <p className="text-sm text-muted-foreground">
            Build magnetic funnels. Generate landing copy + follow-up sequences.
          </p>
        </div>
      </div>

      <section className="rounded-3xl border p-5 space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="text-sm font-medium">Funnel Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-2xl border px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm font-medium">Audience</label>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., local service businesses"
              className="mt-1 w-full rounded-2xl border px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm font-medium">Offer</label>
            <input
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              placeholder="e.g., 7-day content sprint"
              className="mt-1 w-full rounded-2xl border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={generateCopy}
          disabled={!ready}
          className="rounded-2xl border px-4 py-3 text-sm font-semibold hover:bg-muted transition disabled:opacity-50"
        >
          Generate Funnel Copy
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {steps.map((s) => (
          <div key={s.id} className="rounded-3xl border p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <input
                value={s.title}
                onChange={(e) => updateStep(s.id, { title: e.target.value })}
                className="w-full rounded-xl border px-3 py-2 text-sm font-semibold"
              />
            </div>

            <textarea
              value={s.copy}
              onChange={(e) => updateStep(s.id, { copy: e.target.value })}
              placeholder="Copy will appear here…"
              className="min-h-[180px] w-full rounded-2xl border px-3 py-3 text-sm"
            />
          </div>
        ))}
      </section>
    </div>
  );
}
