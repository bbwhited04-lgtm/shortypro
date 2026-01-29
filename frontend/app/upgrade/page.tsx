"use client";

import React from "react";

type Plan = {
  name: string;
  price: string;
  blurb: string;
  features: string[];
  href: string;
  badge?: string;
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$0.99/mo",
    blurb: "Unlock the basics and get moving fast.",
    features: ["Basic dashboard access", "Standard exports", "Email support"],
    // TODO: replace with your real Stripe link
    href: "https://buy.stripe.com/9B6bJ20qJeKjgGGcFF8IU0",
  },
  {
    name: "Pro",
    price: "$9.99/mo",
    blurb: "For creators posting daily and growing fast.",
    features: ["Everything in Starter", "More renders per month", "Priority support"],
    // TODO: replace with your real Stripe link
    href: "https://buy.stripe.com/fZu7sM5L30Tt766a7x8IU01",
    badge: "Most popular",
  },
  {
    name: "Magnetic Funnels",
    price: "$0.99/mo add-on",
    blurb: "Guided 5‑step funnel builder inside your dashboard.",
    features: ["Convert → Nurture → Capture → Engage → Attract", "AI copy + AI image prompts", "Publish-ready assets"],
    // TODO: replace with your real Stripe link
    href: "https://buy.stripe.com/7sY9AUa1j0TtbmmbbB8IU06",
    badge: "Add-on",
  },
];

export default function UpgradePage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Choose your plan</h1>
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          Unlock the ShortyPro portal by subscribing. Your upgrade takes effect instantly after checkout.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14,
            marginTop: 18,
          }}
        >
          {PLANS.map((p) => (
            <div
              key={p.name}
              style={{
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 16,
                padding: 16,
                background: "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{p.name}</div>
                {p.badge && (
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 8px",
                      borderRadius: 999,
                      background: "rgba(0,0,0,0.06)",
                      fontWeight: 700,
                    }}
                  >
                    {p.badge}
                  </span>
                )}
              </div>

              <div style={{ marginTop: 10, fontSize: 22, fontWeight: 900 }}>{p.price}</div>
              <div style={{ marginTop: n, opacity: 0.8 }}>{p.blurb}</div>

              <ul style={{ marginTop: 12, paddingLeft: 18, lineHeight: 1.55 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ marginBottom: 6 }}>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={p.href}
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 12,
                  padding: "12px 12px",
                  borderRadius: 12,
                  background: "black",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                Upgrade to {p.name}
              </a>

              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65 }}>
                Checkout opens in a new Stripe session.
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, fontSize: 12, opacity: 0.65 }}>
          If Stripe links don’t open, make sure you’re using <strong>buy.stripe.com</strong> links and that your browser isn’t blocking popups.
        </div>
      </div>
    </main>
  );
}
