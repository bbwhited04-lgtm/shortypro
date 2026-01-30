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
    <div className="space-y-6">
      <Section
        title="Platforms"
        desc="Toggle where you want to schedule posts."
        right={<div className="text-xs text-neutral-600">{connectedCount} enabled</div>}
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
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white hover:bg-neutral-50",
                ].join(" ")}
              >
                <div className="font-medium">{label}</div>
                <div className={["mt-1 text-sm", on ? "text-white/80" : "text-neutral-600"].join(" ")}>
                  {on ? "Enabled" : "Disabled"}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-neutral-500">
          TODO: wire real OAuth connections + posting APIs.
        </div>
      </Section>

      <Section
        title="Weekly schedule"
        desc="Drag-and-drop comes next. For now, quickly fill a week of posts."
        right={
          <button
            onClick={fillWeek}
            className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800"
          >
            Auto-fill week
          </button>
        }
      >
        <div className="overflow-auto rounded-xl border border-neutral-200">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs text-neutral-600">
              <tr>
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Post title</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s, idx) => (
                <tr key={idx} className="border-t border-neutral-200">
                  <td className="px-4 py-3 font-medium">{s.day}</td>
                  <td className="px-4 py-3 text-neutral-600">{s.time}</td>
                  <td className="px-4 py-3">
                    <input
                      value={s.title || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlots((prev) => prev.map((p, i) => (i === idx ? { ...p, title: val } : p)));
                      }}
                      placeholder="e.g., Hook template #3"
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs text-neutral-500">
          TODO: map slots to generated shorts + schedule jobs.
        </div>
      </Section>
    </div>
  );
}
