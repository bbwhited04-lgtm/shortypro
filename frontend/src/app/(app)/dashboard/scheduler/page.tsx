"use client";

import { useMemo, useState } from "react";
import { Section } from "@/components/dashboard/Cards";

type Slot = { day: string; time: string; title?: string };

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

export default function SchedulerPage() {
  const [platforms, setPlatforms] = useState({
    tiktok: true,
    instagram: true,
    facebook: false,
    youtube: true,
  });

  const [slots, setSlots] = useState<Slot[]>(
    days.flatMap((d) =>
      times.map((t) => ({
        day: d,
        time: t,
        title: "",
      }))
    )
  );

  const connectedCount = useMemo(
    () => Object.values(platforms).filter(Boolean).length,
    [platforms]
  );

  const fillWeek = () => {
    const sample = [
      "Cute cat compilation #1",
      "Quick tip: captions that pop",
      "Before/after edit",
      "Behind the scenes",
      "Story hook template",
      "Bloopers",
      "FAQ answer",
    ];
    setSlots((prev) =>
      prev.map((s, idx) => ({
        ...s,
        title: sample[idx % sample.length],
      }))
    );
  };

  return (
    <div className="min-h-[75vh] w-full rounded-3xl bg-zinc-950 text-zinc-100 border border-zinc-800 p-4 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
      <div className="space-y-6">
      <Section
        title="Platforms"
        desc="Toggle where you want to schedule posts."
        variant="dark"
        right={<div className="text-xs text-zinc-400">{connectedCount} enabled</div>}
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["tiktok", "TikTok"],
            ["instagram", "Instagram"],
            ["facebook", "Facebook"],
            ["youtube", "YouTube Shorts"],
          ].map(([key, label]) => {
            const k = key as keyof typeof platforms;
            const on = platforms[k];
            return (
              <button
                key={key}
                onClick={() => setPlatforms((p) => ({ ...p, [k]: !p[k] }))}
                className={[
                  "rounded-xl border p-4 text-left transition",
                  on
                    ? "border-zinc-700 bg-zinc-900 text-zinc-100"
                    : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60",
                ].join(" ")}
              >
                <div className="font-medium">{label}</div>
                <div className={["mt-1 text-sm", on ? "text-zinc-300" : "text-zinc-400"].join(" ")}>
                  {on ? "Enabled" : "Disabled"}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-zinc-400">
          TODO: wire real OAuth connections + posting APIs.
        </div>
      </Section>

      <Section
        title="Weekly schedule"
        desc="Drag-and-drop comes next. For now, quickly fill a week of posts."
        variant="dark"
        right={
          <button
            onClick={fillWeek}
            className="rounded-xl border border-zinc-800 bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Auto-fill week
          </button>
        }
      >
        <div className="overflow-auto rounded-xl border border-zinc-800">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-zinc-950/60 text-left text-xs text-zinc-400">
              <tr>
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Post title</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s, idx) => (
                <tr key={idx} className="border-t border-zinc-800">
                  <td className="px-4 py-3 font-medium">{s.day}</td>
                  <td className="px-4 py-3 text-zinc-400">{s.time}</td>
                  <td className="px-4 py-3">
                    <input
                      value={s.title || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlots((prev) => prev.map((p, i) => (i === idx ? { ...p, title: val } : p)));
                      }}
                      placeholder="e.g., Hook template #3"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs text-zinc-400">
          TODO: map slots to generated shorts + schedule jobs.
        </div>
      </Section>
      </div>
    </div>
  );
}
