import type { Plan } from "@/lib/plans";

function toPlanEnum(plan: string | null | undefined): Plan {
  const p = (plan ?? "").toLowerCase();

  switch (p) {
    case "starter":
      return "starter";
    case "pro":
      return "pro";
    case "agency":
      return "agency";
    case "free":
      return "free";
    default:
      return "unknown";
  }
}
