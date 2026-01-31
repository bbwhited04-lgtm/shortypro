import AppSidebar from "./AppSidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl p-4 lg:p-6">
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <AppSidebar />
          <main className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
