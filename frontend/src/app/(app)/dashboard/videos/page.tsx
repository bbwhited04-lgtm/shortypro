"use client";

import { useMemo, useState } from "react";
import { Section } from "@/components/dashboard/Cards";

type Video = {
  id: string;
  title: string;
  status: "uploaded" | "processing" | "ready";
  shorts: number;
  createdAt: string;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([
    { id: "v1", title: "Podcast Episode #12", status: "ready", shorts: 7, createdAt: "Today" },
    { id: "v2", title: "Behind the scenes – editing", status: "processing", shorts: 0, createdAt: "Yesterday" },
    { id: "v3", title: "Product demo – ShortyPro", status: "uploaded", shorts: 0, createdAt: "2 days ago" },
  ]);

  const [fileName, setFileName] = useState<string>("");

  const canGenerate = useMemo(() => videos.some(v => v.status === "uploaded"), [videos]);

  const fakeUpload = () => {
    const id = "v" + (videos.length + 1);
    setVideos([
      { id, title: fileName || "New Upload", status: "uploaded", shorts: 0, createdAt: "Just now" },
      ...videos,
    ]);
    setFileName("");
  };

  const generateShorts = () => {
    // Placeholder: replace with your real backend call
    setVideos((prev) =>
      prev.map((v) => {
        if (v.status === "uploaded") return { ...v, status: "processing" };
        return v;
      })
    );

    setTimeout(() => {
      setVideos((prev) =>
        prev.map((v) => {
          if (v.status === "processing") return { ...v, status: "ready", shorts: Math.max(3, v.shorts || 5) };
          return v;
        })
      );
    }, 900);
  };

  return (
    <div className="min-h-[75vh] w-full rounded-3xl bg-zinc-950 text-zinc-100 border border-zinc-800 p-4 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
      <div className="space-y-6">
      <Section
        title="Upload video"
        desc="Drop in a long video. We’ll generate short clips automatically."
        right={
          <button
            onClick={fakeUpload}
            disabled={!fileName}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-800 disabled:opacity-40"
          >
            Upload
          </button>
        }
        variant="dark"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Type a filename to simulate upload (e.g., mypodcast.mp4)"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600"
          />
          <div className="text-xs text-zinc-400">
            (Real file upload wiring point)
          </div>
        </div>
      </Section>

      <Section
        title="Generate shorts"
        desc="Pick a style, then generate multiple clips per video."
        right={
          <button
            onClick={generateShorts}
            disabled={!canGenerate}
            className="rounded-xl border border-zinc-800 bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-40"
          >
            Generate
          </button>
        }
        variant="dark"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {["Fast cuts", "Story / captions", "Podcast highlights"].map((style) => (
            <button
              key={style}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-left hover:bg-zinc-800/60 transition"
              onClick={() => {}}
            >
              <div className="font-medium">{style}</div>
              <div className="mt-1 text-sm text-zinc-400">
                Tune pacing + captions to match this format.
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Your library" desc="Track uploads and generated shorts." variant="dark">
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40">
          <table className="w-full text-sm">
            <thead className="bg-zinc-950/70 text-left text-xs text-zinc-400">
              <tr>
                <th className="px-4 py-3">Video</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Shorts</th>
                <th className="px-4 py-3">Added</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id} className="border-t border-zinc-800">
                  <td className="px-4 py-3 font-medium">{v.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-1 text-xs",
                        v.status === "ready"
                          ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30"
                          : v.status === "processing"
                          ? "bg-amber-500/15 text-amber-200 border border-amber-500/30"
                          : "bg-zinc-800/60 text-zinc-200 border border-zinc-700",
                      ].join(" ")}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{v.shorts}</td>
                  <td className="px-4 py-3 text-zinc-400">{v.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-xs text-zinc-400">
          TODO: wire to backend (upload → process → store clips → list).
        </div>
      </Section>
      </div>
    </div>
  );
}
