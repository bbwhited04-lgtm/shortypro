export default function MagnaHivePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-neutral-900">Magna Hive</h1>
          <p className="mt-2 text-neutral-600">
            Magnetic funnels + lead capture tools (coming online next).
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="font-medium text-neutral-900">Funnels</div>
              <div className="mt-1 text-sm text-neutral-600">
                Build simple pages that turn views into leads.
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="font-medium text-neutral-900">Automation</div>
              <div className="mt-1 text-sm text-neutral-600">
                Route leads into follow-up sequences and scheduling.
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-neutral-500">
            Tip: We’ll wire this into the scheduler + assets library once the core pipeline is stable.
          </div>
        </div>
      </div>
    </div>
  );
}
