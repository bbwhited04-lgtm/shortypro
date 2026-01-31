import Link from "next/link";

const TABS = [
  { label: "Profile", href: "/settings" },
  { label: "Integrations", href: "/settings/integrations" },
  { label: "Billing", href: "/settings/billing" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-zinc-300">Manage your workspace, integrations, and billing.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
        {children}
      </div>
    </div>
  );
}
