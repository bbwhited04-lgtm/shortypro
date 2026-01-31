// Central plan type used everywhere
export type Plan =
  | "free"
  | "starter"
  | "pro"
  | "agency"
  | "unknown";

// Stripe Price ID → Plan mapping
export const PRICE_ID_TO_PLAN: Record<string, Plan> = {
  "price_1SuNTiKC49F2A9OzFrSyGVgv": "starter",
  "price_1SuNYQKC49F2A9OzvS6LqMtM": "pro",
  "price_1SuNclKC49F2A9OzqI4kLooj": "agency",
};

// Helper for Stripe events
export function planFromPriceId(
  priceId: string | null | undefined
): Plan {
  if (!priceId) return "unknown";
  return PRICE_ID_TO_PLAN[priceId] ?? "unknown";
}
