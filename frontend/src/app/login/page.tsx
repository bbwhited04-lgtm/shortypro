"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
// If you use NextAuth, uncomment these:
// import { signIn } from "next-auth/react";

type Provider = "google" | "apple" | "facebook" | "amazon";

export default function SignInPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return identifier.trim().length > 0 && password.length > 0 && !loading;
  }, [identifier, password, loading]);

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Hook this up to your auth system (NextAuth Credentials, custom API, etc.)
      // Example with NextAuth Credentials:
      // await signIn("credentials", { redirect: true, email: identifier, password });

      // Placeholder:
      alert("Wire this to your credentials auth (API/NextAuth).");
    } finally {
      setLoading(false);
    }
  }

  async function handleProviderSignIn(provider: Provider) {
    setLoading(true);
    try {
      // ✅ NextAuth example:
      // await signIn(provider, { callbackUrl: "/dashboard" });

      // Placeholder:
      alert(`Wire this to ${provider} OAuth.`);
    } finally {
      setLoading(false);
    }
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
  <div className="mx-auto flex min-h-screen max-w-[520px] flex-col justify-center px-6 py-10">

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-2">
            {/* Replace with your real logo */}
            <div className="h-7 w-7 rounded-full border border-slate-300" />
            <span className="text-sm font-semibold tracking-tight">ShortyPro</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">Sign in</h1>

          <p className="mt-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            By clicking “Sign in” below, you agree to our{" "}
            <Link className="underline underline-offset-2" href="/terms">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link className="underline underline-offset-2" href="/privacy">
              Privacy Policy
            </Link>
            .
          </p>

          <div className="mt-4 text-sm text-slate-600">
            New here?{" "}
            <Link className="font-medium underline underline-offset-2" href="/auth/sign-up">
              Create an Account
            </Link>
          </div>

          <form onSubmit={handlePasswordSignIn} className="mt-6 space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="identifier">
                  Username or Email <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-slate-700 underline underline-offset-2"
                  onClick={() => alert("Optional: implement email-only toggle")}
                >
                  Use email
                </button>
              </div>

              <input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@domain.com"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                autoComplete="username"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-slate-700 underline underline-offset-2"
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>

              <input
                id="password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                autoComplete="current-password"
              />
            </div>

            <label className="flex select-none items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
              />
              Keep me signed in on this device
            </label>

            <button
              type="submit"
              disabled={!canSubmit}
              className="h-12 w-full rounded-xl bg-black text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <div className="text-xs text-slate-500">or sign in with</div>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <IconButton label="Amazon" onClick={() => handleProviderSignIn("amazon")}>a</IconButton>
            <IconButton label="Apple" onClick={() => handleProviderSignIn("apple")}></IconButton>
            <IconButton label="Facebook" onClick={() => handleProviderSignIn("facebook")}>f</IconButton>
            <IconButton label="Google" onClick={() => handleProviderSignIn("google")}>G</IconButton>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link className="text-slate-700 underline underline-offset-2" href="/auth/forgot-password">
              Need to find your username or your password?
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Dead App Corp. All rights reserved.{" "}
          <Link className="underline underline-offset-2" href="/privacy">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
    >
      {children}
    </button>
  );
}
