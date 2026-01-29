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
    <div className="space-y-6">
      <Section
        title="Upload video"
        desc="Drop in a long video. We’ll generate short clips automatically."
        right={
          <button
            onClick={fakeUpload}
            disabled={!fileName}
            className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            Upload
          </button>
        }
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Type a filename to simulate upload (e.g., mypodcast.mp4)"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
          />
          <div className="text-xs text-neutral-500">
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
            className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            Generate
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {["Fast cuts", "Story / captions", "Podcast highlights"].map((style) => (
            <button
              key={style}
              className="rounded-xl border border-neutral-200 bg-white p-4 text-left hover:bg-neutral-50"
              onClick={() => {}}
            >
              <div className="font-medium">{style}</div>
              <div className="mt-1 text-sm text-neutral-600">
                Tune pacing + captions to match this format.
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Your library" desc="Track uploads and generated shorts.">
        <div className="overflow-hidden rounded-xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs text-neutral-600">
              <tr>
                <th className="px-4 py-3">Video</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Shorts</th>
                <th className="px-4 py-3">Added</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id} className="border-t border-neutral-200">
                  <td className="px-4 py-3 font-medium">{v.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-1 text-xs",
                        v.status === "ready"
                          ? "bg-green-50 text-green-700"
                          : v.status === "processing"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-neutral-100 text-neutral-700",
                      ].join(" ")}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{v.shorts}</td>
                  <td className="px-4 py-3 text-neutral-600">{v.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-xs text-neutral-500">
          TODO: wire to backend (upload → process → store clips → list).
        </div>
      </Section>
    </div>
  );
}
