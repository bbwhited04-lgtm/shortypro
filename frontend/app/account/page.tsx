async function getMe() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/me`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

export default async function AccountPage() {
  // Server-side fetch may not include cookies depending on host; this page is optional.
  // You can also make this a client component if you want to show live session info.
  const me = await getMe().catch(() => null);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900 }}>Account & Settings</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>
        Manage your subscription, connected social accounts, and profile settings.
      </p>

      <section style={{ marginTop: 16, border: "1px solid #e5e7eb", borderRadius: 16, padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>Subscription</h2>
        <div style={{ marginTop: 8, opacity: 0.9 }}>
          {me?.authenticated ? (
            <>
              <div><b>Email:</b> {me.email}</div>
              <div><b>Plan:</b> {me.plan}</div>
              <div><b>Status:</b> {me.status}</div>
            </>
          ) : (
            <div>Not signed in.</div>
          )}
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/upgrade"><button style={{ padding: "10px 14px", borderRadius: 12, fontWeight: 800 }}>Upgrade</button></a>
          <a href="/api/auth/demo-logout?next=/"><button style={{ padding: "10px 14px", borderRadius: 12 }}>Sign out</button></a>
        </div>
      </section>

      <section style={{ marginTop: 16, border: "1px solid #e5e7eb", borderRadius: 16, padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>Connect Social Profiles (UI stub)</h2>
        <p style={{ marginTop: 6, opacity: 0.8 }}>
          OAuth wiring comes next (Google + Facebook + Instagram + Threads + X + LinkedIn + YouTube + TikTok + Pinterest).
        </p>

        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {["Google", "Facebook", "Instagram", "Threads", "X", "LinkedIn", "YouTube", "TikTok", "Pinterest"].map((n) => (
            <div key={n} style={{ border: "1px solid #eee", borderRadius: 14, padding: 12 }}>
              <div style={{ fontWeight: 800 }}>{n}</div>
              <div style={{ opacity: 0.75, marginTop: 4 }}>Not connected</div>
              <button style={{ marginTop: 8, padding: "8px 12px", borderRadius: 12 }}>
                Connect
              </button>
            </div>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 16 }}>
        <a href="/portal/" style={{ textDecoration: "underline" }}>Back to portal</a>
      </div>
    </main>
  );
}
