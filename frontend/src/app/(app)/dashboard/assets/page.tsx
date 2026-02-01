"use client";

import { useState } from "react";
import { Section } from "@/components/dashboard/Cards";

export default function AssetsPage() {
  const [brandName, setBrandName] = useState("ShortyPro");
  const [watermark, setWatermark] = useState("shortypro.com");
  const [captionStyle, setCaptionStyle] = useState("Bold • High contrast • Bottom");

  return (
    <div className="min-h-[75vh] w-full rounded-3xl bg-zinc-950 text-zinc-100 border border-zinc-800 p-4 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
      <div className="space-y-6">
      <Section variant="dark" title="Brand presets" desc="These settings apply to new shorts you generate.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <div className="text-xs text-zinc-400">Brand name</div>
            <input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            />
          </div>
          <div>
            <div className="text-xs text-zinc-400">Watermark text</div>
            <input
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            />
          </div>
          <div>
            <div className="text-xs text-zinc-400">Caption style</div>
            <input
              value={captionStyle}
              onChange={(e) => setCaptionStyle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            />
          </div>
        </div>
        <div className="mt-3 text-xs text-zinc-400">TODO: store per-user, apply during render.</div>
      </Section>

      <Section variant="dark" title="Hashtag bank" desc="Save hashtags you reuse so posts stay consistent.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            "#shorts #contentcreator #viral",
            "#tiktokmarketing #reels #growth",
            "#podcastclips #entrepreneur #business",
            "#howto #tips #ai",
          ].map((h) => (
            <div key={h} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-sm text-zinc-200">
              {h}
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-zinc-400">TODO: add create/edit/delete.</div>
      </Section>
      </div>
    </div>
  );
}
