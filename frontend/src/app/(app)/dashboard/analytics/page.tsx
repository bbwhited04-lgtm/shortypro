import { Section } from "@/components/dashboard/Cards";

type Metric = {
  label: string;
  value: string;
  delta?: string;
  tone?: "blue" | "green" | "amber" | "pink" | "violet" | "slate";
};

function PastelCard({ m }: { m: Metric }) {
  const tone = m.tone ?? "slate";

  const toneClass: Record<NonNullable<Metric["tone"]>, string> = {
    blue: "bg-sky-500/10 border-sky-500/25",
    green: "bg-emerald-500/10 border-emerald-500/25",
    amber: "bg-amber-500/10 border-amber-500/25",
    pink: "bg-pink-500/10 border-pink-500/25",
    violet: "bg-violet-500/10 border-violet-500/25",
    slate: "bg-zinc-900/40 border-zinc-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${toneClass[tone]}`}>
      <div className="text-xs text-zinc-400">{m.label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">{m.value}</div>
      {m.delta ? <div className="mt-1 text-xs text-zinc-400">{m.delta}</div> : null}
    </div>
  );
}

function PlaceholderChart({ title }: { title: string }) {
  // Lightweight placeholder (no deps). Replace with real chart lib later.
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="text-sm font-semibold text-zinc-100">{title}</div>
      <div className="mt-3 h-40 w-full rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950" />
      <div className="mt-2 text-xs text-zinc-400">
        Placeholder — wire to platform APIs when ready.
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  // NOTE: These are placeholders. Once social accounts are connected, swap these
  // values for real metrics from your backend.
  const overview: Metric[] = [
    { label: "Followers", value: "—", delta: "All connected accounts", tone: "blue" },
    { label: "Engagement", value: "—", delta: "Likes, comments, shares", tone: "green" },
    { label: "Reach", value: "—", delta: "Unique viewers", tone: "amber" },
    { label: "Impressions", value: "—", delta: "Total views", tone: "violet" },
    { label: "Post clicks", value: "—", delta: "Link clicks / CTA", tone: "pink" },
    { label: "Avg watch time", value: "—", delta: "Shorts + longform", tone: "slate" },
  ];

  return (
    <div className="min-h-[75vh] w-full rounded-3xl bg-zinc-950 text-zinc-100 border border-zinc-800 p-4 shadow-[0_30px_80px_rgba(0,0,0,.35)]">
      <div className="space-y-6">
      <Section variant="dark" title="Analytics" desc="Clean, simple dashboards (no clutter).">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {overview.map((m) => (
            <PastelCard key={m.label} m={m} />
          ))}
        </div>
      </Section>

      <Section variant="dark" title="Social overview" desc="Fast read on the metrics marketers care about.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PlaceholderChart title="Engagement over time" />
          <PlaceholderChart title="Reach + impressions trend" />
        </div>
      </Section>

<Section variant="dark"
  title="Ad insights"
  desc="Track spend, CPC, and conversions without turning the page into a cockpit."
>
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <PastelCard m={{ label: "Spend", value: "—", delta: "Last 7 days", tone: "slate" }} />
    <PastelCard m={{ label: "CPC", value: "—", delta: "Cost per click", tone: "amber" }} />
    <PastelCard m={{ label: "CTR", value: "—", delta: "Click-through rate", tone: "blue" }} />
    <PastelCard m={{ label: "Conversions", value: "—", delta: "Leads / sales", tone: "green" }} />
  </div>

  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
    <div className="lg:col-span-2">
      <PlaceholderChart title="Spend + CPC trend" />
    </div>
    <PlaceholderChart title="Top campaigns" />
  </div>
</Section>

      <Section variant="dark"
        title="Audience"
        desc="A simple demographic + engagement view (similar to the Coupler.io feel)."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <PlaceholderChart title="Followers by country" />
          <PlaceholderChart title="Age distribution" />
          <PlaceholderChart title="Gender split" />
        </div>
      </Section>

      <Section variant="dark" title="Trend analysis" desc="Spot what’s working (posts, hooks, topics, and formats).">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PlaceholderChart title="Top posts (last 30 days)" />
          <PlaceholderChart title="Hashtags / topics trending" />
        </div>
      </Section>

      <Section variant="dark"
        title="Web traffic"
        desc="Optional: merge site analytics so you can tie posts → clicks → conversions."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PlaceholderChart title="Traffic sources" />
          <PlaceholderChart title="Desktop vs mobile" />
        </div>
      </Section>

      <Section variant="dark" title="Account health" desc="Connection status + posting health per platform.">
        <div className="rounded-2xl border bg-white p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <PastelCard m={{ label: "TikTok", value: "Connected", delta: "Posting OK", tone: "green" }} />
            <PastelCard
              m={{ label: "Instagram", value: "Connected", delta: "Posting OK", tone: "green" }}
            />
            <PastelCard
              m={{
                label: "Facebook",
                value: "Not connected",
                delta: "Connect to start posting",
                tone: "amber",
              }}
            />
            <PastelCard m={{ label: "YouTube", value: "Connected", delta: "Shorts enabled", tone: "blue" }} />
          </div>
        </div>
      </Section>
      </div>
    </div>
  );
}
