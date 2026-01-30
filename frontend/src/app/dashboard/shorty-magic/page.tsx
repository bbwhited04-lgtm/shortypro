// src/app/dashboard/shorty-magic/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function ShortyMagicPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0">
          <Image
            src="/public/shortypro/shortymagic-logo.jpg"
            alt="Shorty Magic"
            fill
            priority
            className="object-contain"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Shorty Magic</h1>
          <p className="text-sm text-muted-foreground">
            Upload/link a video → generate shorts → add to calendar.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border p-5">
        <div className="font-semibold">Coming next</div>
        <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>Drop MP4 or paste YouTube link</li>
          <li>Pick template + overlay text</li>
          <li>Generate 10 shorts</li>
          <li>Push to Calendar queue</li>
        </ul>
      </div>

      <Link
        href="/dashboard"
        className="inline-flex rounded-xl border px-4 py-2 text-sm hover:bg-muted transition"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
