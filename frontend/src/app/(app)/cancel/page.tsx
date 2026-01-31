export default function Cancel() {
  return (
    <main className="min-h-screen bg-[#0b0f14] text-white px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-semibold">Payment canceled</h1>
        <p className="mt-3 text-slate-300">No worries — you can try again anytime.</p>
        <a className="mt-6 inline-block rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900" href="/">
          Back to home
        </a>
      </div>
    </main>
  );
}
