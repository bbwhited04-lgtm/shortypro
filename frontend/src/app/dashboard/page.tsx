import { Section, StatCard } from "@/components/dashboard/Cards";
import { redirect } from "next/navigation";

export default function Dashboard() {
  redirect("/dashboard/index.html");
}
export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Videos in processing" value="2" hint="Auto-clips running" />
        <StatCard label="Shorts generated (7d)" value="18" hint="Your best pace yet" />
        <StatCard label="Scheduled (next 7d)" value="12" hint="Across TikTok/IG/FB/YT" />
        <StatCard label="Posts published (30d)" value="44" hint="Keep momentum" />
      </div>

      <Section
        title="Next steps"
        desc="Run your content pipeline in under 5 minutes."
      >
        <ol className="list-decimal space-y-2 pl-5 text-sm text-neutral-700">
          <li>Go to <span className="font-medium">Videos</span> and upload your long clip.</li>
          <li>Pick your clip style (fast cuts / story / podcast).</li>
          <li>Generate 5–10 shorts.</li>
          <li>Open <span className="font-medium">Scheduler</span> and drag into your posting calendar.</li>
        </ol>
      </Section>

      <Section
        title="Platform health"
        desc="This is a simple placeholder — you can replace it with real API status later."
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            ["TikTok", "Connected", "Posting OK"],
            ["Instagram", "Connected", "Posting OK"],
            ["Facebook", "Not connected", "Connect to start posting"],
            ["YouTube", "Connected", "Shorts enabled"],
          ].map(([p, s, h]) => (
            <div key={p} className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{p}</div>
                <div className="text-xs text-neutral-600">{s}</div>
              </div>
              <div className="mt-1 text-sm text-neutral-600">{h}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
