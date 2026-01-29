"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function Topbar() {
  const router = useRouter();

  const logout = () => {
    try {
      localStorage.removeItem("shortypro_token");
    } catch {}
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm text-neutral-600">
        Tip: Start in <Link className="underline" href="/dashboard/videos">Videos</Link> to upload & generate shorts.
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm hover:bg-neutral-50"
        >
          View site
        </Link>
        <button
          onClick={logout}
          className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
