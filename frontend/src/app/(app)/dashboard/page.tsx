export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-zinc-300">
        Snapshot: scheduled posts, active funnels, leads today, and AI suggestions.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {["Scheduled Posts", "Leads Captured", "Funnel Conversion"].map((t) => (
          <div key={t} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="text-sm text-zinc-400">{t}</div>
            <div className="text-2xl font-bold text-zinc-100">—</div>
          </div>
        ))}
      </div>
    </div>
  );
}
