"use client";

import { useState } from "react";

export default function DreamBuyButton({
  email,
  className,
  children,
}: {
  email?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  async function handleBuyDream() {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/dream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || undefined,
          successUrl: `${window.location.origin}/dashboard?dream=success`,
          cancelUrl: `${window.location.origin}/dream?dream=cancel`,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Checkout failed");
      if (!data?.url) throw new Error("No checkout URL returned");

      window.location.href = data.url;
    } catch (e: any) {
      alert(e?.message ?? "Dream checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className={className} onClick={handleBuyDream} disabled={loading}>
      {loading ? "Redirecting..." : children ?? "Buy The Dream"}
    </button>
  );
}
