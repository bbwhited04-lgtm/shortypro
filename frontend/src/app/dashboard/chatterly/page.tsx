import { Section } from "@/components/dashboard/Cards";
import Link from "next/link";

export default function ChatterlyPage() {
  return (
    <div className="space-y-6">
      <Section
        title="Chatterly"
        desc="AI chat + unified inbox across platforms (coming online)."
      >
        <div className="rounded-2xl border bg-white p-4 text-sm text-neutral-700">
          <p className="font-semibold">What this will do</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Connect Facebook Pages + Instagram + YouTube + more</li>
            <li>One inbox, quick replies, saved templates</li>
            <li>Assign conversations + notes for teams</li>
          </ul>

          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="underline" href="/dashboard/settings">
              Connect accounts in Settings
            </Link>
            <Link className="underline" href="/dashboard/help">
              View quick-start Help
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
