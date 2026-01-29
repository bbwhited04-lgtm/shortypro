export type Plan = "none" | "starter" | "pro" | "agency";

export const PRICE_ID_TO_PLAN: Record<string, Plan> = {
  // Provided by Billy
  "price_1SuNTiKC49F2A9OzFrSyGVgv": "starter",
  "price_1SuNYQKC49F2A9OzvS6LqMtM": "pro",
  "price_1SuNclKC49F2A9OzqI4kLooj": "agency",
};

export function planFromPriceId(priceId?: string | null): Plan {
  if (!priceId) return "none";
  return PRICE_ID_TO_PLAN[priceId] ?? "none";
}

export function isPaidPlan(plan: Plan): boolean {
  return plan !== "none";
}
