export default function LoginPage({ searchParams }: { searchParams?: { next?: string } }) {
  const next = searchParams?.next || "/portal/";
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>Sign in to ShortyPro</h1>
      <p style={{ marginTop: 8, opacity: 0.85, maxWidth: 720 }}>
        This is the secure gateway to your ShortyPro portal. Next step is wiring Google Sign-In.
        For now, use the demo login to generate a session cookie. After you subscribe, the portal will unlock automatically.
      </p>

      <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href={`/api/auth/demo-login?email=billy@deadapp.info&next=${encodeURIComponent(next)}`}>
          <button style={{ padding: "10px 14px", borderRadius: 12, fontWeight: 700 }}>
            Demo login (Billy)
          </button>
        </a>

        <form
          action="/api/auth/demo-login"
          method="GET"
          style={{ display: "flex", gap: 10, alignItems: "center" }}
        >
          <input type="hidden" name="next" value={next} />
          <input
            name="email"
            placeholder="your@email.com"
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              minWidth: 260,
            }}
          />
          <button style={{ padding: "10px 14px", borderRadius: 12, fontWeight: 700 }}>
            Demo login
          </button>
        </form>
      </div>

      <div style={{ marginTop: 22 }}>
        <a href="/upgrade" style={{ textDecoration: "underline" }}>
          View plans / upgrade
        </a>
      </div>
    </main>
  );
}
