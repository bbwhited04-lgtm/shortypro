"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

type Provider = "google" | "apple" | "facebook" | "amazon";

export default function SignInPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState<null | "password" | Provider>(null);

  const canSubmit = useMemo(() => {
    return identifier.trim().length > 0 && password.length > 0 && !loading;
  }, [identifier, password, loading]);

  function getCallbackUrl() {
    // supports /login?next=/dashboard/... if you use that pattern
    const next =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("next")
        : null;
    return next || "/dashboard";
  }

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading("password");
    try {
      // If/when you add Credentials auth:
      // await signIn("credentials", {
      //   redirect: true,
      //   email: identifier,
      //   password,
      //   callbackUrl: getCallbackUrl(),
      // });

      // For now, keep it explicitly "not wired" so nobody assumes passwords work.
      alert("Password sign-in not enabled yet. Use Google for now.");
    } finally {
      setLoading(null);
    }
  }

  async function handleProviderSignIn(provider: Provider) {
    setLoading(provider);
    try {
      await signIn(provider, { callbackUrl: getCallbackUrl() });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
      <div className="mx-auto flex min-h-screen max-w-[560px] flex-col justify-center px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-7 w-7 rounded-full border border-slate-300" />
            <span className="text-sm font-semibold tracking-tight">ShortyPro</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">Sign in</h1>

          <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            Simple, straightforward sign-in. Multiple trusted login providers help verify your identity.
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
                className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
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
                className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
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
              {loading === "password" ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <div className="text-xs text-slate-500">or sign in with</div>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Provider buttons: +120% size + stronger presence */}
          <div className="grid grid-cols-4 gap-4">
            <ProviderButton
              label="Amazon"
              loading={loading === "amazon"}
              onClick={() => handleProviderSignIn("amazon")}
            >
              <AmazonIcon />
            </ProviderButton>

            <ProviderButton
              label="Apple"
              loading={loading === "apple"}
              onClick={() => handleProviderSignIn("apple")}
            >
              <AppleIcon />
            </ProviderButton>

            <ProviderButton
              label="Facebook"
              loading={loading === "facebook"}
              onClick={() => handleProviderSignIn("facebook")}
            >
              <FacebookIcon />
            </ProviderButton>

            <ProviderButton
              label="Google"
              loading={loading === "google"}
              onClick={() => handleProviderSignIn("google")}
            >
              <GoogleIcon />
            </ProviderButton>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link className="text-slate-700 underline underline-offset-2" href="/auth/forgot-password">
              Need to find your username or your password?
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-white/70">
          © {new Date().getFullYear()} Dead App Corp. All rights reserved.{" "}
          <Link className="underline underline-offset-2" href="/privacy">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProviderButton({
  label,
  loading,
  onClick,
  children,
}: {
  label: string;
  loading: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={loading}
      className="flex h-[72px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition
                 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60"
      title={label}
    >
      <span className="sr-only">{label}</span>
      <div className="scale-[1.2]">{loading ? <Spinner /> : children}</div>
    </button>
  );
}

function Spinner() {
  return (
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
  );
}

/* Simple icons (no dependencies) */
function GoogleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.2l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.1-.1-2.2-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15 19 12 24 12c3.1 0 5.9 1.2 8 3.2l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.7 26.8 36 24 36c-5.3 0-9.8-3.3-11.4-8l-6.6 5.1C9.3 39.7 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.7-3 4.9-5.6 6.3l.1-.1 6.3 5.3C39.8 36.4 44 31.3 44 24c0-1.1-.1-2.2-.4-3.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.44 2.2-1.29 3.1-.9.95-2.38 1.68-3.64 1.58-.16-1.12.36-2.28 1.2-3.17.9-.95 2.44-1.65 3.73-1.51zM20.2 17.2c-.45 1.05-.67 1.52-1.24 2.44-.8 1.28-1.93 2.88-3.33 2.9-1.25.02-1.57-.82-3.25-.81-1.68 0-2.03.83-3.29.8-1.4-.02-2.46-1.46-3.26-2.74-2.24-3.57-2.47-7.76-1.09-9.88.98-1.5 2.54-2.38 3.99-2.38 1.49 0 2.43.82 3.27.82.82 0 2.07-1.02 3.49-.87.59.02 2.25.24 3.32 1.82-2.92 1.6-2.45 5.8.39 7.1z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="#1877F2">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8.1V12h2.3V9.8c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.4.7-1.4 1.4V12h2.4l-.4 2.9h-2v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function AmazonIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M6.5 14.5c-.7 0-1.5-.2-2.2-.6-.3-.2-.4-.5-.2-.8.2-.3.5-.4.8-.2 2.9 1.7 7.5 1.5 10.8-.1.3-.2.7-.1.8.2.2.3.1.7-.2.8-1.9 1-4.2 1.5-6.4 1.5z" />
      <path d="M17.8 13.6c-.3-.4-.8-.5-1.1-.2-.2.2-.2.4-.2.7.1.6 0 1.1-.4 1.7-.2.3-.1.6.2.8.3.2.6.1.8-.2.6-.8.8-1.7.7-2.8z" />
      <path d="M15.9 10.6V8.9c0-2.2-1.5-3.6-4-3.6-1.6 0-3.3.5-4.4 1.3-.2.2-.3.5-.1.7l.9 1.2c.2.2.5.3.8.1.8-.5 1.6-.8 2.5-.8 1.2 0 1.8.6 1.8 1.7v.2c-2.7.3-6.3 1-6.3 4.2 0 2 1.4 3.2 3.4 3.2 1.3 0 2.4-.5 3.3-1.4.2.6.7 1.2 1.5 1.2.6 0 1.2-.3 1.6-.7.2-.2.2-.5 0-.7l-.6-.7c-.3-.4-.4-.7-.4-1.2zm-2.9 2.5c-.5.6-1.1.9-1.8.9-.8 0-1.2-.5-1.2-1.2 0-1.4 1.6-1.8 3-2v2.3z" />
    </svg>
  );
}
