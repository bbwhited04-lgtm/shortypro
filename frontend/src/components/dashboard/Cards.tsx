export function StatCard({
  label,
  value,
  hint,
  variant = "light",
}: {
  label: string;
  value: string;
  hint?: string;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  return (
    <div
      className={[
        "rounded-2xl border p-4 shadow-sm",
        isDark
          ? "border-zinc-800 bg-zinc-900/40 text-zinc-100"
          : "border-neutral-200 bg-white text-neutral-900",
      ].join(" ")}
    >
      <div className={isDark ? "text-xs text-zinc-400" : "text-xs text-neutral-500"}>
        {label}
      </div>
      <div className={isDark ? "mt-1 text-2xl font-semibold" : "mt-1 text-2xl font-semibold"}>
        {value}
      </div>
      {hint ? (
        <div className={isDark ? "mt-2 text-xs text-zinc-400" : "mt-2 text-xs text-neutral-500"}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}

export function Section({
  title,
  desc,
  children,
  right,
  variant = "light",
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  return (
    <section
      className={[
        "rounded-2xl border p-5 shadow-sm",
        isDark
          ? "border-zinc-800 bg-zinc-900/40 text-zinc-100"
          : "border-neutral-200 bg-white text-neutral-900",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {desc ? (
            <p className={isDark ? "mt-1 text-sm text-zinc-400" : "mt-1 text-sm text-neutral-600"}>
              {desc}
            </p>
          ) : null}
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
