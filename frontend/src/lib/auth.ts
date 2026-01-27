import { cookies } from "next/headers";
import { ENV } from "./env";

export function getToken(): string | null {
  const c = cookies().get(ENV.AUTH_COOKIE_NAME);
  return c?.value ?? null;
}
