"use client";

import React, { useEffect, useMemo, useState } from "react";

type TemplateKey = "lead" | "appointment" | "product" | "webinar";

type Funnel = {
  id: string;
  name: string;
  slug: string;
  template: TemplateKey;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaUrl: string;
  bullets: string[];
  bgImage: string; // url or local path
  updatedAt: number;
};

const STORAGE_KEY = "magna_hive_funnels_v1";

/** Punchier, more premium presets (short + sharp) */
const TEMPLATE_PRESETS: Record<TemplateKey, Partial<Funnel>> = {
  lead: {
    name: "Lead Magnet Funnel",
    template: "lead",
    headline: "Steal the exact checklist that brings leads in daily",
    subheadline:
      "Download the free guide and plug it into your business in under 10 minutes. Fast, clean, and built to convert.",
    ctaLabel: "Get the free guide",
    ctaUrl: "https://www.shortypro.com/dream#buy",
    bullets: ["Instant delivery", "No fluff — just the steps", "Works in any niche"],
    bgImage: "/shortypro/thedreampack-image.jpg",
  },
  appointment: {
    name: "Appointment Funnel",
    template: "appointment",
    headline: "Book a 15-minute strategy call",
    subheadline:
      "Pick a time. We’ll map your next 30 days and show you the simplest path to results — no pressure.",
    ctaLabel: "Choose a time",
    ctaUrl: "https://www.shortypro.com/dashboard",
    bullets: ["Quick, clear plan", "No sales ambush", "Walk away with next steps"],
    bgImage: "/shortypro/thedreampack-image.jpg",
  },
  product: {
    name: "Product Funnel",
    template: "product",
    headline: "Own your stack — stop renting your business",
    subheadline:
      "Funnels + CRM + Scheduling + Video + AI in one place. Build once, keep forever. Your audience is the asset.",
    ctaLabel: "Unlock access",
    ctaUrl: "https://www.shortypro.com/dream#buy",
    bullets: ["Built by DEAD APP CORP", "Simple setup — serious power", "Make content → capture leads → convert"],
    bgImage: "/shortypro/thedreampack-image.jpg",
  },
  webinar: {
    name: "Webinar Funnel",
    template: "webinar",
    headline: "Join the live training — copy the exact workflow",
    subheadline:
      "Watch the system run end-to-end: create, publish, capture, and follow up. Q&A included, replay link after.",
    ctaLabel: "Reserve my seat",
    ctaUrl: "https://www.shortypro.com/dream",
    bullets: ["Live demo", "Q&A included", "Replay link delivered"],
    bgImage: "/shortypro/thedreampack-image.jpg",
  },
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function loadFunnels(): Funnel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr as Funnel[];
  } catch {
    return [];
  }
}

function saveFunnels(funnels: Funnel[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(funnels));
}

export default function MagnaHivePage() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => funnels.find((f) => f.id === selectedId) || null,
    [funnels, selectedId]
  );

  useEffect(() => {
    const loaded = loadFunnels();
    setFunnels(loaded);
    if (loaded.length) setSelectedId(loaded[0].id);
  }, []);

  function createFromTemplate(template: TemplateKey) {
    const preset = TEMPLATE_PRESETS[template];
    const name = preset.name || "New Funnel";
    const id = uid();
    const slug = `${slugify(name)}-${id.slice(0, 6)}`;
    const next: Funnel = {
      id,
      name,
      slug,
      template,
      headline: preset.headline || "Headline",
      subheadline: preset.subheadline || "Subheadline",
      ctaLabel: preset.ctaLabel || "Get started",
      ctaUrl: preset.ctaUrl || "https://www.shortypro.com",
      bullets: preset.bullets || ["Bullet one", "Bullet two", "Bullet three"],
      bgImage: preset.bgImage || "/shortypro/thedreampack-image.jpg",
      updatedAt: Date.now(),
    };
    const updated = [next, ...funnels];
    setFunnels(updated);
    setSelectedId(next.id);
    saveFunnels(updated);
  }

  function updateSelected(patch: Partial<Funnel>) {
    if (!selected) return;
    const updated = funnels.map((f) =>
      f.id === selected.id ? { ...f, ...patch, updatedAt: Date.now() } : f
    );
    setFunnels(updated);
    saveFunnels(updated);
  }

  function deleteSelected() {
    if (!selected) return;
    const updated = funnels.filter((f) => f.id !== selected.id);
    setFunnels(updated);
    saveFunnels(updated);
    setSelectedId(updated[0]?.id ?? null);
  }

  function copyShareLink() {
    if (!selected) return;
    const url = `${window.location.origin}/funnel/${selected.slug}`;
    navigator.clipboard?.writeText(url);
    alert(`Copied:\n${url}`);
  }

  return (
    <div className="min-h-[75vh] w-full rounded-3xl bg-zinc-950 text-zinc-100 border border-zinc-800 p-4 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
   <div className="relative mx-auto max-w-6xl px-4 py-6 text-zinc-100">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-[680px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-24 right-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* HERO */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Pill>
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                Live Builder
              </Pill>
              <Pill>Instant Share Links</Pill>
              <Pill>Few-click Publishing</Pill>
              <Pill>Own the Stack</Pill>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              Magna Hive
            </h1>
            <p className="mt-3 text-lg text-white/75">
              Build a high-converting funnel in minutes:
              <span className="text-white"> choose a launch mode</span>, tweak the copy,{" "}
              <span className="text-white">copy the link</span>, and publish.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Stat label="Templates" value="4 launch modes" />
              <Stat label="Setup time" value="~2–5 minutes" />
              <Stat label="Output" value="One clean share link" />
            </div>
          </div>

          <div className="md:text-right">
            <div className="text-xs text-white/60">Start from a launch mode:</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <TemplateBtn
                label="Lead Magnet"
                sub="Collect emails fast"
                onClick={() => createFromTemplate("lead")}
              />
              <TemplateBtn
                label="Book Calls"
                sub="Schedule leads instantly"
                onClick={() => createFromTemplate("appointment")}
              />
              <TemplateBtn
                label="Sell Product"
                sub="Direct response checkout"
                onClick={() => createFromTemplate("product")}
              />
              <TemplateBtn
                label="Run Webinar"
                sub="Register + replay funnel"
                onClick={() => createFromTemplate("webinar")}
              />
            </div>

            <div className="mt-3 text-xs text-white/50">
              Pro tip: keep the headline under 10 words — make the result obvious.
            </div>
          </div>
        </div>

        {/* Quickstart */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <StepCard
            step="Step 1"
            title="Pick a template"
            body="Choose a launch mode that matches your goal: leads, calls, product, or webinar."
          />
          <StepCard
            step="Step 2"
            title="Edit the words"
            body="Headline + bullets + CTA. Short. Clear. One action."
          />
          <StepCard
            step="Step 3"
            title="Copy & publish"
            body="Drop the share link into your bio, ads, posts, email, or calendar."
          />
        </div>
      </div>

      {/* MAIN */}
      <div className="mt-8 grid gap-6 md:grid-cols-12">
        {/* Left: list */}
        <div className="md:col-span-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Your funnels</div>
              <div className="text-xs text-white/60">{funnels.length} total</div>
            </div>

            {funnels.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                <div className="font-semibold text-white">No funnels yet.</div>
                <div className="mt-1 text-white/70">
                  Click a launch mode above to generate your first funnel in seconds.
                </div>
                <div className="mt-3 text-xs text-white/50">
                  Best practice: promise one outcome, remove every extra decision.
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {funnels.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedId(f.id)}
                    className={[
                      "w-full rounded-2xl border px-4 py-3 text-left transition",
                      selectedId === f.id
                        ? "border-white/25 bg-white/10"
                        : "border-white/10 bg-black/20 hover:bg-black/30",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold">{f.name}</div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/70">
                        {prettyTemplate(f.template)}
                      </div>
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-white/60">
                      {f.headline}
                    </div>
                    <div className="mt-2 text-[11px] text-white/40">
                      Updated {timeAgo(f.updatedAt)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: editor + preview */}
        <div className="md:col-span-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            {!selected ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-white/70">
                <div className="text-white font-semibold">Quickstart</div>
                <ol className="mt-3 space-y-2 text-sm text-white/70 list-decimal pl-5">
                  <li>Click a launch mode (top right).</li>
                  <li>Edit headline + bullets + CTA.</li>
                  <li>Copy the share link and publish it anywhere.</li>
                </ol>
                <div className="mt-4 text-xs text-white/50">
                  Create multiple funnels per campaign and rotate links anytime.
                </div>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Editor */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      value={selected.name}
                      onChange={(e) =>
                        updateSelected({
                          name: e.target.value,
                          slug: `${slugify(e.target.value)}-${selected.id.slice(0, 6)}`,
                        })
                      }
                      className={inputCls}
                      placeholder="Funnel name"
                    />
                    <button
                      onClick={deleteSelected}
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/70 hover:bg-black/40"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs text-white/60">Conversion Cheats</div>
                    <div className="mt-2 space-y-1 text-xs text-white/70">
                      <div>• Headline: promise a result (not a process)</div>
                      <div>• Bullets: remove confusion, reduce risk, add proof</div>
                      <div>• CTA: one action — “Get”, “Book”, “Start”, “Reserve”</div>
                    </div>
                  </div>

                  <Field
                    label="Headline"
                    hint="Keep it short. Make the outcome obvious."
                  >
                    <input
                      value={selected.headline}
                      onChange={(e) => updateSelected({ headline: e.target.value })}
                      className={inputCls}
                    />
                  </Field>

                  <Field
                    label="Subheadline"
                    hint="One sentence: who it’s for + what happens next."
                  >
                    <textarea
                      value={selected.subheadline}
                      onChange={(e) => updateSelected({ subheadline: e.target.value })}
                      className={textareaCls}
                      rows={3}
                    />
                  </Field>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="CTA label" hint="Use a verb + benefit.">
                      <input
                        value={selected.ctaLabel}
                        onChange={(e) => updateSelected({ ctaLabel: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="CTA link" hint="Where the button sends them.">
                      <input
                        value={selected.ctaUrl}
                        onChange={(e) => updateSelected({ ctaUrl: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Background image URL"
                    hint="Use a local path (recommended) or any https image."
                  >
                    <input
                      value={selected.bgImage}
                      onChange={(e) => updateSelected({ bgImage: e.target.value })}
                      className={inputCls}
                    />
                    <div className="mt-1 text-xs text-white/50">
                      Example:{" "}
                      <span className="text-white/70">/shortypro/thedreampack-image.jpg</span>
                    </div>
                  </Field>

                  <Field
                    label="Bullet points"
                    hint="3–5 bullets. Each one should reduce doubt or increase desire."
                  >
                    <div className="space-y-2">
                      {selected.bullets.map((b, i) => (
                        <input
                          key={i}
                          value={b}
                          onChange={(e) => {
                            const next = [...selected.bullets];
                            next[i] = e.target.value;
                            updateSelected({ bullets: next });
                          }}
                          className={inputCls}
                        />
                      ))}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            updateSelected({ bullets: [...selected.bullets, "New bullet"] })
                          }
                          className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/70 hover:bg-black/40"
                        >
                          + Add bullet
                        </button>
                        <button
                          onClick={() =>
                            updateSelected({
                              bullets: selected.bullets.slice(0, Math.max(1, selected.bullets.length - 1)),
                            })
                          }
                          className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/70 hover:bg-black/40"
                        >
                          − Remove last
                        </button>
                      </div>
                    </div>
                  </Field>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={copyShareLink}
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
                    >
                      Copy share link
                    </button>
                    <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/70">
                      /funnel/{selected.slug}
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">Live Preview</div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/70">
                      {prettyTemplate(selected.template)}
                    </div>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black">
                    <div
                      className="relative h-60 bg-cover bg-center"
                      style={{ backgroundImage: `url(${selected.bgImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/75 to-black" />
                      <div className="relative p-5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/80">
                          <span className="h-2 w-2 rounded-full bg-white/60" />
                          Magna Hive
                        </div>
                        <div className="mt-4 text-2xl font-extrabold leading-tight">
                          {selected.headline}
                        </div>
                        <div className="mt-2 text-sm text-white/80">
                          {selected.subheadline}
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="space-y-2">
                        {selected.bullets.slice(0, 5).map((b, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-white/80">
                            <span className="mt-[6px] h-2 w-2 rounded-full bg-white/60" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>

                      <div className="inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
>
                        <a
                          href={selected.ctaUrl}
                          className="inline-block rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-black/90"
                        >
                          {selected.ctaLabel}
                        </a>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                        <div className="font-semibold text-white">Share link</div>
                        <div className="mt-1 text-white/70">/funnel/{selected.slug}</div>
                      </div>

                      <div className="mt-3 text-[11px] text-white/45">
                        Tip: This preview is the “conversion card” — keep everything scannable.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-white/50">
            Magna Hive currently stores funnels in your browser (localStorage). Next: save to your
            account + publish pages automatically.
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

/* ---------------- UI Bits ---------------- */

function TemplateBtn({
  label,
  sub,
  onClick,
}: {
  label: string;
  sub?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-black/30 text-xs">
          +
        </span>
        <span>{label}</span>
      </div>
      {sub ? <div className="mt-1 text-xs font-normal text-white/60">{sub}</div> : null}
    </button>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div className="text-xs text-white/70">{label}</div>
        {hint ? <div className="text-[11px] text-white/45">{hint}</div> : null}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
      <div className="text-[11px] text-white/50">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function StepCard({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="text-xs text-white/60">{step}</div>
      <div className="mt-1 text-lg font-bold">{title}</div>
      <div className="mt-1 text-sm text-white/70">{body}</div>
    </div>
  );
}

function prettyTemplate(t: TemplateKey) {
  switch (t) {
    case "lead":
      return "Lead Magnet";
    case "appointment":
      return "Appointments";
    case "product":
      return "Product";
    case "webinar":
      return "Webinar";
    default:
      return t;
  }
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white outline-none focus:border-white/20";
const textareaCls =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white outline-none focus:border-white/20";
