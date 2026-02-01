import type { Metadata } from "next";
import { Brand } from "@/components/dashboard/Brand";
import { Nav } from "@/components/dashboard/Nav";
import { Topbar } from "@/components/dashboard/Topbar";
import { Guard } from "@/components/dashboard/Guard";

export const metadata: Metadata = {
  title: "ShortyPro Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Guard>
      <div className="min-h-screen bg-neutral-50 [background:radial-gradient(900px_520px_at_20%_-10%,rgba(73,215,255,.12),transparent_60%),radial-gradient(900px_520px_at_85%_-5%,rgba(255,79,216,.10),transparent_60%),#fafafa]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm backdrop-blur">
            <Brand />
            <Nav />

            <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600">
              <div className="font-semibold text-neutral-900">Quick setup</div>
              <div className="mt-1">
                Upload a long video → generate shorts → schedule → post.
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white/90 p-4 shadow-sm backdrop-blur">
              <Topbar />
            </div>
            {children}
          </main>
        </div>
      </div>
    </Guard>
  );
}
