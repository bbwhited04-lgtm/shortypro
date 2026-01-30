"use client";

import { useState } from "react";
import { Section } from "@/components/dashboard/Cards";

export default function AssetsPage() {
  const [brandName, setBrandName] = useState("ShortyPro");
  const [watermark, setWatermark] = useState("shortypro.com");
  const [captionStyle, setCaptionStyle] = useState("Bold • High contrast • Bottom");

  return (
    <div className="space-y-6">
      <Section title="Brand presets" desc="These settings apply to new shorts you generate.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <div className="text-xs text-neutral-500">Brand name</div>
            <input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
          <div>
            <div className="text-xs text-neutral-500">Watermark text</div>
            <input
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
          <div>
            <div className="text-xs text-neutral-500">Caption style</div>
            <input
              value={captionStyle}
              onChange={(e) => setCaptionStyle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
        </div>
        <div className="mt-3 text-xs text-neutral-500">TODO: store per-user, apply during render.</div>
      </Section>

      <Section title="Hashtag bank" desc="Save hashtags you reuse so posts stay consistent.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            "#shorts #contentcreator #viral",
            "#tiktokmarketing #reels #growth",
            "#podcastclips #entrepreneur #business",
            "#howto #tips #ai",
          ].map((h) => (
            <div key={h} className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
              {h}
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-neutral-500">TODO: add create/edit/delete.</div>
      </Section>
    </div>
  );
}
