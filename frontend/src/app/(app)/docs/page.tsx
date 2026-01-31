export default function DocsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Docs</h1>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="text-xl font-semibold">What’s included</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-300">
          <li>Next.js frontend (Vercel)</li>
          <li>FastAPI backend (Render)</li>
          <li>Postgres database (Render)</li>
          <li>Login + Dashboard + Profile</li>
          <li>Social links + share buttons</li>
          <li>Cross-links to your other sites</li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">How it works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-slate-300">
          <li>Frontend logs in via Next route: <code className="text-slate-100">/api/auth/login</code></li>
          <li>Next stores the token in a httpOnly cookie</li>
          <li>Dashboard calls backend with that token</li>
        </ol>
      </div>
    </div>
  );
}
