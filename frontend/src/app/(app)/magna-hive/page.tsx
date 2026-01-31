"use client";

import { useEffect, useMemo, useState } from "react";

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

const TEMPLATE_PRESETS: Record<TemplateKey, Partial<Funnel>> = {
  lead: {
    name: "Lead Magnet Funnel",
    template: "lead",
    headline: "Get the free guide in 60 seconds",
    subheadline: "One proven checklist to increase leads this week.",
    ctaLabel: "Get the guide",
    ctaUrl: "https://www.shortypro.com/dream#buy",
    bullets: ["Instant download", "No spam", "Works for any niche"],
    bgImage: "/shortypro/thedreampack-image.jpg",
  },
  appointment: {
    name: "Appointment Funnel",
    template: "appointment",
    headline: "Book a quick call",
    subheadline: "Pick a time and we’ll build your plan in 15 minutes.",
    ctaLabel: "Schedule now",
    ctaUrl: "https://www.shortypro.com/dashboard",
    bullets: ["Fast setup", "Clear next steps", "No pressure"],
    bgImage: "/shortypro/thedreampack-image.jpg",
  },
  product: {
    name: "Product Funnel",
    template: "product",
    headline: "Own your stack — stop paying subscriptions",
    subheadline: "CRM + Funnels + Video + AI + Scheduling under one roof.",
    ctaLabel: "Buy now",
    ctaUrl: "https://www.shortypro.com/dream#buy",
    bullets: ["Cancel anytime", "Built by DEAD APP CORP", "Your audience is an asset — own it"],
    bgImage: "/shortypro/thedreampack-image.jpg",
  },
  webinar: {
    name: "Webinar Funnel",
    template: "webinar",
    headline: "Join the live training",
    subheadline: "See the full system in action and copy the exact workflow.",
    ctaLabel: "Reserve my seat",
    ctaUrl: "https://www.shortypro.com/dream",
    bullets: ["Live demo", "Q&A included", "Replay link"],
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
    <div className="mx-auto max-w-6xl px-6 py-10 text-white">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Magna Hive</h1>
          <p className="mt-1 text-white/70">
            Build simple funnels fast. Few clicks. Publish. Own the stack.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <TemplateBtn label="Lead Magnet" onClick={() => createFromTemplate("lead")} />
          <TemplateBtn label="Appointment" onClick={() => createFromTemplate("appointment")} />
          <TemplateBtn label="Product" onClick={() => createFromTemplate("product")} />
          <TemplateBtn label="Webinar" onClick={() => createFromTemplate("webinar")} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-12">
        {/* Left: list */}
        <div className="md:col-span-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Your funnels</div>
              <div className="text-xs text-white/60">{funnels.length}</div>
            </div>

            {funnels.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                Create your first funnel using a template above.
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
                        ? "border-white/20 bg-white/10"
                        : "border-white/10 bg-black/20 hover:bg-black/30",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{f.name}</div>
                      <div className="text-[11px] text-white/50">{f.template}</div>
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-white/60">
                      {f.headline}
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
                Pick a funnel or create one from a template.
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
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
                      placeholder="Funnel name"
                    />
                    <button
                      onClick={deleteSelected}
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/70 hover:bg-black/40"
                    >
                      Delete
                    </button>
                  </div>

                  <Field label="Headline">
                    <input
                      value={selected.headline}
                      onChange={(e) => updateSelected({ headline: e.target.value })}
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Subheadline">
                    <textarea
                      value={selected.subheadline}
                      onChange={(e) => updateSelected({ subheadline: e.target.value })}
                      className={textareaCls}
                      rows={3}
                    />
                  </Field>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="CTA label">
                      <input
                        value={selected.ctaLabel}
                        onChange={(e) => updateSelected({ ctaLabel: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="CTA link">
                      <input
                        value={selected.ctaUrl}
                        onChange={(e) => updateSelected({ ctaUrl: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Background image URL">
                    <input
                      value={selected.bgImage}
                      onChange={(e) => updateSelected({ bgImage: e.target.value })}
                      className={inputCls}
                    />
                    <div className="mt-1 text-xs text-white/50">
                      Tip: use <span className="text-white/70">/shortypro/thedreampack-image.jpg</span> or any https image.
                    </div>
                  </Field>

                  <Field label="Bullet points">
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
                      <button
                        onClick={() => updateSelected({ bullets: [...selected.bullets, "New bullet"] })}
                        className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/70 hover:bg-black/40"
                      >
                        + Add bullet
                      </button>
                    </div>
                  </Field>

                  <div className="flex flex-wrap gap-2 pt-2">
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
                  <div className="text-xs text-white/60">Preview</div>
                  <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black">
                    <div
                      className="relative h-56 bg-cover bg-center"
                      style={{ backgroundImage: `url(${selected.bgImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
                      <div className="relative p-5">
                        <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/80">
                          Magna Hive • {selected.template}
                        </div>
                        <div className="mt-3 text-2xl font-extrabold leading-tight">
                          {selected.headline}
                        </div>
                        <div className="mt-2 text-sm text-white/80">
                          {selected.subheadline}
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="space-y-2">
                        {selected.bullets.slice(0, 4).map((b, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-white/80">
                            <span className="mt-[6px] h-2 w-2 rounded-full bg-white/60" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 inline-block rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 p-[2px]">
                        <a
                          href={selected.ctaUrl}
                          className="inline-block rounded-full bg-black px-5 py-2 text-sm font-semibold text-white"
                        >
                          {selected.ctaLabel}
                        </a>
                      </div>

                      <div className="mt-3 text-xs text-white/50">
                        Share link: /funnel/{selected.slug}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-white/50">
            v0 stores funnels in your browser (localStorage). Next step: save to DB + publish to your audience.
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
    >
      + {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs text-white/60">{label}</div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white outline-none focus:border-white/20";
const textareaCls =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white outline-none focus:border-white/20";
