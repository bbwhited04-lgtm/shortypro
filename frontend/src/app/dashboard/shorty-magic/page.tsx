"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type JobResponse = {
  id: string;
  status: "queued" | "processing" | "done" | "failed";
  shorts?: Array<{
    id: string;
    title: string;
    durationSec: number;
  }>;
  error?: string;
};

export default function ShortyMagicPage() {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [overlayText, setOverlayText] = useState("");

  const [job, setJob] = useState<JobResponse | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = useMemo(() => {
    if (busy) return false;
    if (mode === "url") return url.trim().length > 8;
    return !!file;
  }, [busy, mode, url, file]);

  async function startJob() {
    setBusy(true);
    setJob(null);

    try {
      const form = new FormData();
      form.set("mode", mode);
      form.set("overlayText", overlayText);

      if (mode === "url") form.set("url", url.trim());
      if (mode === "upload" && file) form.set("file", file);

      const res = await fetch("/api/shorty-magic/job", {
        method: "POST",
        body: form,
      });

      const data = (await res.json()) as JobResponse;

      if (!res.ok) {
        setJob({ id: "none", status: "failed", error: data.error || "Failed" });
        return;
      }

      setJob(data);
      await pollJob(data.id);
    } catch (e: any) {
      setJob({ id: "none", status: "failed", error: e?.message || "Error" });
    } finally {
      setBusy(false);
    }
  }

  async function pollJob(id: string) {
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 600));
      const res = await fetch(`/api/shorty-magic/job/${id}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as JobResponse;
      setJob(data);
      if (data.status === "done" || data.status === "failed") return;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0">
          <Image
            src="/shortypro/shortymagic-logo.jpg"
            alt="Shorty Magic"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Shorty Magic</h1>
          <p className="text-sm text-muted-foreground">
            Paste a link or upload a video → generate 10 shorts → push to calendar queue.
          </p>
        </div>
      </div>

      {/* Step 1 */}
      <section className="rounded-3xl border p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold">Step 1 — Choose input</div>
            <div className="text-sm text-muted-foreground">
              YouTube link or MP4 upload.
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                mode === "url" ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              Link
            </button>
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                mode === "upload" ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              Upload
            </button>
          </div>
        </div>

        {mode === "url" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium">YouTube URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload MP4</label>
            <input
              type="file"
              accept="video/mp4,video/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            {file && (
              <div className="text-xs text-muted-foreground">
                Selected: {file.name} (
                {Math.round(file.size / 1024 / 1024)} MB)
              </div>
            )}
          </div>
        )}
      </section>

      {/* Step 2 */}
      <section className="rounded-3xl border p-5 space-y-4">
        <div>
          <div className="font-semibold">Step 2 — Overlay text (optional)</div>
          <div className="text-sm text-muted-foreground">
            Default caption overlay for generated shorts.
          </div>
        </div>

        <input
          value={overlayText}
          onChange={(e) => setOverlayText(e.target.value)}
          placeholder="e.g., '3 mistakes everyone makes…'"
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />

        <button
          type="button"
          disabled={!canSubmit}
          onClick={startJob}
          className="rounded-2xl border px-4 py-3 text-sm font-semibold hover:bg-muted transition disabled:opacity-50"
        >
          {busy ? "Generating…" : "Generate 10 Shorts"}
        </button>
      </section>

      {/* Results */}
      {job && (
        <section className="rounded-3xl border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Job status</div>
            <span className="text-sm text-muted-foreground">{job.status}</span>
          </div>

          {job.error && (
            <div className="text-sm text-red-600">{job.error}</div>
          )}

          {job.shorts && job.shorts.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Generated shorts (stub results for now):
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {job.shorts.map((s) => (
                  <div key={s.id} className="rounded-2xl border p-4">
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {s.durationSec}s
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
