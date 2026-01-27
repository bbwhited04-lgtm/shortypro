export default function FAQPage() {
  const items = [
    {
      q: "Do I need a separate YouTube channel?",
      a: "Recommended: yes — keep brand content clean and consistent."
    },
    {
      q: "Where do social links live?",
      a: "In Vercel env vars (NEXT_PUBLIC_SOCIAL_*). Add new ones later without code changes."
    },
    {
      q: "Why FastAPI + Postgres?",
      a: "Scales cleanly, reusable across domains, and built for APIs."
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">FAQ</h1>
      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.q} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
            <div className="text-lg font-semibold">{it.q}</div>
            <div className="mt-2 text-slate-300">{it.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
