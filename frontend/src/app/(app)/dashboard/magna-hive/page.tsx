import { Section } from "@/components/dashboard/Cards";
import Link from "next/link";

export default function MagnaHivePage() {
  return (
    <div className="space-y-6">
      <Section
        title="Magna Hive"
        desc="Magnetic funnels + lead capture + automations (coming online)."
      >
        <div className="rounded-2xl border bg-white p-4 text-sm text-neutral-700">
          <p className="font-semibold">What this will do</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Funnel templates (lead magnet, booking, sales)</li>
            <li>Forms → email/SMS/webhook delivery</li>
            <li>Calendar + posting tie-in</li>
          </ul>

          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="underline" href="/dashboard/scheduler">
              Go to Scheduler
            </Link>
            <Link className="underline" href="/dashboard/analytics">
              See Analytics
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
