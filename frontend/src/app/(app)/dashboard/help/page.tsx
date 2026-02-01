import React from "react";
import Link from "next/link";
import { Section } from "@/components/dashboard/Cards";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="text-sm font-semibold text-zinc-100">{title}</div>
      <div className="mt-2 text-sm text-zinc-300">{children}</div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-[75vh] w-full rounded-3xl bg-zinc-950 text-zinc-100 border border-zinc-800 p-4 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
      <div className="space-y-6">
      <Section
        title="Help"
        desc="Quick-start guides + a ready-to-record CapCut script."
        variant="dark"
      >
        {/* Top two cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card title="1) The 60-second workflow">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Go to{" "}
                <Link className="underline" href="/dashboard/videos">
                  Videos
                </Link>
                .
              </li>
              <li>
                Drop in a YouTube link <em>or</em> upload an MP4.
              </li>
              <li>
                Click <strong>Generate</strong> to create 5–10 shorts.
              </li>
              <li>
                Review the results in{" "}
                <Link className="underline" href="/dashboard/assets">
                  Assets
                </Link>
                .
              </li>
              <li>
                Drag them into the{" "}
                <Link className="underline" href="/dashboard/scheduler">
                  Scheduler
                </Link>{" "}
                and set times.
              </li>
            </ol>
          </Card>

          <Card title="2) Connect accounts (posting)">
            <p>
              Connect your social accounts from{" "}
              <Link className="underline" href="/dashboard/settings">
                Settings
              </Link>
              . Once connected, you can pick which pages/channels belong to which
              posting group.
            </p>
            <p className="mt-2">
              Tip: Start with one platform (TikTok or YouTube) to validate the
              workflow, then add Instagram + Facebook.
            </p>
          </Card>
        </div>

        {/* Three-wide section */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card title="CapCut: simple editing recipe">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Import your screen recording + one example short from ShortyPro.
              </li>
              <li>
                Add auto-captions, then bump font size and add a soft shadow for
                readability.
              </li>
              <li>Cut dead air. Keep pace snappy (no long pauses).</li>
              <li>Add a subtle whoosh transition between steps (don’t overdo it).</li>
              <li>Export in 1080×1920 (vertical), 30fps.</li>
            </ol>
          </Card>

          <Card title="CapCut voiceover script (copy/paste)">
            <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-900">
              {`Want your long video turned into daily shorts—fast?

Here’s the ShortyPro flow in under a minute.

Step one: click Videos.
Drop in a YouTube link or upload your MP4.
Hit Generate.

ShortyPro automatically cuts it into bite-sized shorts.
Step two: open Assets to preview.
Pick your favorites.

Step three: go to Scheduler.
Drag the shorts onto your calendar.
Pick your post times.

That’s it—upload, generate, schedule.

Try it at shortypro.com.
Built by DEAD APP CORP.`}
            </p>
          </Card>

          <Card title="Safety + compliance (quick)">
            <ul className="list-disc space-y-2 pl-5">
              <li>Use your own footage (or properly licensed clips/music).</li>
              <li>Avoid brand logos/product shots you don’t have rights to.</li>
              <li>When in doubt: replace music with royalty-free audio.</li>
            </ul>
          </Card>
        </div>

        {/* Links */}
        <Card title="Links">
          <div className="flex flex-wrap gap-3">
            <a className="underline" href="/index.html">
              ShortyPro home
            </a>
            <a
              className="underline"
              href="https://viraldead.pro"
              target="_blank"
              rel="noreferrer"
            >
              ViralDead
            </a>
            <a
              className="underline"
              href="https://deadapp.pro"
              target="_blank"
              rel="noreferrer"
            >
              DeadApp
            </a>
          </div>
        </Card>
      </Section>
      </div>
    </div>
  );
}
