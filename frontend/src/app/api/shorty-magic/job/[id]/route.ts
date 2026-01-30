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

const JOBS = (globalThis as any).__SHORTY_JOBS__ ?? new Map<string, Job>();
(globalThis as any).__SHORTY_JOBS__ = JOBS;

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const job = JOBS.get(ctx.params.id);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json(job);
}
