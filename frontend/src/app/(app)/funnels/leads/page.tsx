export default function LeadsPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Leads</h1>
      <p className="text-zinc-300">
        MVP: this page will list captured emails per funnel + export.
      </p>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
        <div className="text-sm text-zinc-400">No leads yet</div>
        <div className="text-xs text-zinc-500 mt-1">
          Next: connect Email Capture card → DB → show rows here.
        </div>
      </div>
    </div>
  );
}
