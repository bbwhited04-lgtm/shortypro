const PLANS = [
  {
    name: "Starter",
    price: "$?",
    link: "https://buy.stripe.com/9B6bJ20qJeKjgGGcfF8IU00",
    features: ["Video creation (limited)", "Basic portal access"],
  },
  {
    name: "Pro",
    price: "$?",
    link: "https://buy.stripe.com/fZu7sM5L30Tt766a7x8IU01",
    features: ["Everything in Starter", "Publishing calendar", "Analytics"],
  },
  {
    name: "Agency",
    price: "$?",
    link: "https://buy.stripe.com/cNi28s5L37hRcqq4Nd8IU02",
    features: ["Everything in Pro", "Magnetic Funnels", "Multi-client workflows"],
  },
];

export default function UpgradePage({ searchParams }: { searchParams?: { next?: string } }) {
  const next = searchParams?.next || "/portal/";
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Upgrade ShortyPro</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Your portal is locked until an active subscription is detected.
      </p>

      <div style={{ marginTop: 16, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {PLANS.map((p) => (
          <section key={p.name} style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>{p.name}</h2>
            <div style={{ opacity: 0.8, marginTop: 6 }}>{p.price}</div>
            <ul style={{ marginTop: 10, paddingLeft: 18, opacity: 0.9 }}>
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              <a href={p.link} target="_blank" rel="noreferrer">
                <button style={{ padding: "10px 14px", borderRadius: 12, fontWeight: 800 }}>
                  Buy {p.name}
                </button>
              </a>
              <a href={`/portal/`}><button style={{ padding: "10px 14px", borderRadius: 12 }}>Try portal</button></a>
            </div>
          </section>
        ))}
      </div>

      <p style={{ marginTop: 16, opacity: 0.75 }}>
        After checkout completes, it can take a moment for Stripe to send the webhook. If you still see this page,
        refresh once after ~30 seconds.
      </p>

      <div style={{ marginTop: 16 }}>
        <a href={`/api/auth/demo-logout?next=${encodeURIComponent(next)}`} style={{ textDecoration: "underline" }}>
          Sign out
        </a>
      </div>
    </main>
  );
}
