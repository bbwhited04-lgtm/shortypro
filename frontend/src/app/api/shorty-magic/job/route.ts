import { NextResponse } from "next/server";

type Job = {
  id: string;
  status: "queued" | "processing" | "done" | "failed";
  createdAt: number;
  overlayText?: string;
  mode: "url" | "upload";
  url?: string;
  filename?: string;
  shorts?: Array<{ id: string; title: string; durationSec: number }>;
  error?: string;
};

// ⚠️ Dev-only in-memory store (fine for now)
const JOBS = (globalThis as any).__SHORTY_JOBS__ ?? new Map<string, Job>();
(globalThis as any).__SHORTY_JOBS__ = JOBS;

function id() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

async function getEntitlements() {
  // Calls your dashboard "me" endpoint
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/dashboard/me`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as any;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const form = await req.formData();
  const mode = (form.get("mode") as string) || "url";
  const overlayText = (form.get("overlayText") as string) || "";

  // ✅ Gate feature
  const ent = await getEntitlements();
  const allowed = !!ent?.isAdmin || !!ent?.features?.shortyMagic;
  if (!allowed) {
    return NextResponse.json({ error: "Shorty Magic is locked. Upgrade to unlock." }, { status: 403 });
  }

  const jobId = id();

  const job: Job = {
    id: jobId,
    status: "queued",
    createdAt: Date.now(),
    overlayText,
    mode: mode === "upload" ? "upload" : "url",
  };

  if (job.mode === "url") {
    const url = (form.get("url") as string) || "";
    if (!url || url.length < 8) {
      return NextResponse.json({ error: "Missing or invalid URL" }, { status: 400 });
    }
    job.url = url;
  } else {
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    job.filename = file.name;
    // NOTE: We are not saving file bytes yet—this is just wiring.
  }

  JOBS.set(jobId, job);

  // Simulate processing (replace with real ffmpeg pipeline later)
  setTimeout(() => {
    const j = JOBS.get(jobId);
    if (!j) return;
    j.status = "processing";
    JOBS.set(jobId, j);

    setTimeout(() => {
      const j2 = JOBS.get(jobId);
      if (!j2) return;
      j2.status = "done";
      j2.shorts = Array.from({ length: 10 }).map((_, idx) => ({
        id: `${jobId}-${idx + 1}`,
        title: `Short #${idx + 1}${j2.overlayText ? ` — ${j2.overlayText}` : ""}`,
        durationSec: 8,
      }));
      JOBS.set(jobId, j2);
    }, 1200);
  }, 600);

  return NextResponse.json({ id: jobId, status: "queued" });
}
