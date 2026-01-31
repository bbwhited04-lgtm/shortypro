"use client";

import { useEffect } from "react";

type Props = {
  buyButtonId: string;
  publishableKey: string;
};

export default function StripeBuyButton({ buyButtonId, publishableKey }: Props) {
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://js.stripe.com/v3/buy-button.js"]'
    );
    if (existing) return;

    const s = document.createElement("script");
    s.async = true;
    s.src = "https://js.stripe.com/v3/buy-button.js";
    document.body.appendChild(s);
  }, []);

  // @ts-expect-error - stripe web component provided by Stripe
  return <stripe-buy-button buy-button-id={buyButtonId} publishable-key={publishableKey} />;
}
