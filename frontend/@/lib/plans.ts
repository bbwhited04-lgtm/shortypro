import { Plan } from "@prisma/client";

export function planFromPriceId(priceId?: string | null): Plan {
  switch (priceId) {
    case "price_1Svf9SKC49F2A9OzZ8X4OIL6":
      return Plan.DREAM;
    default:
      return Plan.NONE;
  }
}
