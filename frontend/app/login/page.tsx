export default function LoginPage({ searchParams }: { searchParams?: { next?: string } }) {
  const next = searchParams?.next || "/portal/";
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Sign in to ShortyPro</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        This is a placeholder. Next step is wiring Google login + Stripe subscription validation.
      </p>

      <div style={{ marginTop: 16 }}>
        <a href={`/api/auth/demo-login?next=${encodeURIComponent(next)}`}>
          <button style={{ padding: "10px 14px", borderRadius: 10, fontWeight: 600 }}>
            Demo login (sets cookie)
          </button>
        </a>
      </div>
    </main>
  );
}
