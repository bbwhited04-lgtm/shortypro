"use client";

import { useMemo, useState } from "react";

type CardType = "video" | "text" | "cta" | "email";
type FunnelCard = {
  id: string;
  type: CardType;
  title?: string;
  body?: string;
  videoUrl?: string;
  buttonText?: string;
  buttonHref?: string;
};

const MAX_CARDS = 10;

function uid() {
  return crypto.randomUUID();
}

export default function FunnelsPage() {
  const [name, setName] = useState("New Funnel");
  const [published, setPublished] = useState(false);

  const [cards, setCards] = useState<FunnelCard[]>([
    { id: uid(), type: "video", videoUrl: "" },
    { id: uid(), type: "text", title: "Big promise headline", body: "Short supporting text." },
    { id: uid(), type: "cta", buttonText: "Get it now", buttonHref: "" },
    { id: uid(), type: "email", title: "Get updates", body: "Drop your email to get the free guide." },
  ]);

  const canAdd = cards.length < MAX_CARDS;

  const stats = useMemo(() => {
    const types = cards.reduce<Record<CardType, number>>(
      (a, c) => ((a[c.type] = (a[c.type] || 0) + 1), a),
      { video: 0, text: 0, cta: 0, email: 0 }
    );
    return types;
  }, [cards]);

  function addCard(type: CardType) {
    if (!canAdd) return;
    const base: FunnelCard =
      type === "video"
        ? { id: uid(), type, videoUrl: "" }
        : type === "text"
        ? { id: uid(), type, title: "Headline", body: "Body text..." }
        : type === "cta"
        ? { id: uid(), type, buttonText: "Click here", buttonHref: "" }
        : { id: uid(), type, title: "Join the list", body: "Enter your email to get updates." };

    setCards((prev) => [...prev, base]);
  }

  function move(i: number, dir: -1 | 1) {
    setCards((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
      return copy;
    });
  }

  function remove(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  function update(id: string, patch: Partial<FunnelCard>) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Funnels (Magna Hive)</h1>
          <p className="text-zinc-300">
            5–10 cards max. Build a micro-funnel that converts attention into emails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-semibold hover:bg-zinc-900"
            onClick={() => alert("Publish will generate a share link next (we’ll wire it).")}
          >
            Share Link
          </button>

          <button
            type="button"
            className={[
              "rounded-2xl px-4 py-2 text-sm font-semibold border transition",
              published
                ? "border-emerald-700 bg-emerald-600 hover:bg-emerald-500"
                : "border-zinc-800 bg-blue-600 hover:bg-blue-500",
            ].join(" ")}
            onClick={() => setPublished((p) => !p)}
          >
            {published ? "Published" : "Publish"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 space-y-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="text-sm text-zinc-300">
            Funnel name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
            />
          </label>

          <div className="text-xs text-zinc-400">
            Cards: <span className="text-zinc-200 font-semibold">{cards.length}</span> / {MAX_CARDS} •{" "}
            Video {stats.video} • Text {stats.text} • CTA {stats.cta} • Email {stats.email}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!canAdd}
            onClick={() => addCard("video")}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900 disabled:opacity-50"
          >
            + Video
          </button>
          <button
            type="button"
            disabled={!canAdd}
            onClick={() => addCard("text")}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900 disabled:opacity-50"
          >
            + Text
          </button>
          <button
            type="button"
            disabled={!canAdd}
            onClick={() => addCard("cta")}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900 disabled:opacity-50"
          >
            + CTA
          </button>
          <button
            type="button"
            disabled={!canAdd}
            onClick={() => addCard("email")}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900 disabled:opacity-50"
          >
            + Email Capture
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {cards.map((c, i) => (
          <div key={c.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-zinc-100">
                Card {i + 1} • <span className="text-blue-400 uppercase">{c.type}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm hover:bg-zinc-900"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm hover:bg-zinc-900"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm hover:bg-zinc-900"
                >
                  Remove
                </button>
              </div>
            </div>

            {c.type === "video" && (
              <div className="mt-3 space-y-2">
                <label className="text-sm text-zinc-300">
                  Video URL (mp4 or YouTube)
                  <input
                    value={c.videoUrl || ""}
                    onChange={(e) => update(c.id, { videoUrl: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
                    placeholder="https://..."
                  />
                </label>
                <div className="text-xs text-zinc-500">
                  MVP: URL now. Later: upload + auto-short slicing + captions.
                </div>
              </div>
            )}

            {c.type === "text" && (
              <div className="mt-3 grid gap-2">
                <input
                  value={c.title || ""}
                  onChange={(e) => update(c.id, { title: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
                  placeholder="Headline"
                />
                <textarea
                  value={c.body || ""}
                  onChange={(e) => update(c.id, { body: e.target.value })}
                  className="min-h-[90px] w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
                  placeholder="Body text..."
                />
              </div>
            )}

            {c.type === "cta" && (
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <input
                  value={c.buttonText || ""}
                  onChange={(e) => update(c.id, { buttonText: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
                  placeholder="Button text"
                />
                <input
                  value={c.buttonHref || ""}
                  onChange={(e) => update(c.id, { buttonHref: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
                  placeholder="Button link (optional)"
                />
                <div className="md:col-span-2 text-xs text-zinc-500">
                  CTA can link out, or later route to Email Capture / Checkout / Scheduler.
                </div>
              </div>
            )}

            {c.type === "email" && (
              <div className="mt-3 space-y-2">
                <input
                  value={c.title || ""}
                  onChange={(e) => update(c.id, { title: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
                  placeholder="Email capture headline"
                />
                <textarea
                  value={c.body || ""}
                  onChange={(e) => update(c.id, { body: e.target.value })}
                  className="min-h-[70px] w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
                  placeholder="Short description..."
                />
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <div className="text-xs text-zinc-400">Preview</div>
                  <div className="text-sm font-semibold text-zinc-100">{c.title || "Join the list"}</div>
                  <div className="text-sm text-zinc-300">{c.body || "Enter your email."}</div>
                  <div className="mt-2 flex gap-2">
                    <input
                      className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none"
                      placeholder="email@domain.com"
                      disabled
                    />
                    <button
                      className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-500"
                      type="button"
                      disabled
                    >
                      Submit
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-zinc-500">
                    Next: wire to DB table + export + bulk mail.
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 text-sm text-zinc-300">
        <div className="font-semibold text-zinc-100">Next wiring (after UI is live)</div>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Publish generates share URL: <code className="text-zinc-200">/f/{`{slug}`}</code></li>
          <li>Email Capture writes to DB (Leads table)</li>
          <li>Leads export CSV + webhook</li>
          <li>Calendar: “Post funnel link” templates</li>
        </ul>
      </div>
    </div>
  );
}
