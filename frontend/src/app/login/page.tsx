"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json().catch(() => ({}));
    setLoading(false);
    if (!r.ok) return setErr(data?.error || "Login failed");
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-bold">Login</h1>
      <form onSubmit={submit} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
        <div>
          <label className="text-sm text-slate-300">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2" />
        </div>
        {err && <div className="text-sm text-red-300">{err}</div>}
        <button disabled={loading} className="w-full rounded-lg bg-emerald-500 px-3 py-2 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
