"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    // Quick demo auth: store a token so dashboard guard passes.
    // TODO: replace with real auth.
    try {
      localStorage.setItem("shortypro_token", "demo-token");
    } catch {}
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold">Log in</div>
        <p className="mt-1 text-sm text-neutral-600">
          Access your ShortyPro dashboard.
        </p>

        <form onSubmit={login} className="mt-6 space-y-4">
          <div>
            <div className="text-xs text-neutral-500">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
              placeholder="you@company.com"
              required
            />
          </div>
          <div>
            <div className="text-xs text-neutral-500">Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800"
          >
            Continue
          </button>

          <div className="text-center text-xs text-neutral-500">
            Demo login (replace with real auth later).
          </div>
        </form>
      </div>
    </div>
  );
}
