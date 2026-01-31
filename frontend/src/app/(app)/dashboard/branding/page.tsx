import Link from "next/link";
import { Section } from "@/components/dashboard/Cards";

type Logo = {
  name: string;
  file: string; // used for download filename
  url: string;
};

function LogoTile({ logo }: { logo: Logo }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold">{logo.name}</div>

        <div className="flex items-center gap-2">
          <a
            href={logo.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
          >
            View
          </a>

          {/* download attr works best when same-origin (your shortypro.com files are) */}
          <a
            href={logo.url}
            download={logo.file}
            className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
          >
            Download
          </a>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center rounded-xl border bg-white p-3">
        <img
          src={logo.url}
          alt={`${logo.name} logo`}
          className="h-16 max-w-[240px] object-contain"
        />
      </div>

      <div className="mt-3 text-xs text-neutral-500">
        File: <span className="font-mono">{logo.file}</span>
      </div>
    </div>
  );
}

export default function BrandingPage() {
  const corporate: Logo[] = [
    {
      name: "DEAD APP CORP",
      file: "deadappcorp-logo.png",
      url: "https://shortypro.com/shortypro/deadappcorp-logo.png",
    },
  ];

  const products: Logo[] = [
    {
      name: "ShortyPro",
      file: "shortypro-logo.png",
      url: "https://shortypro.com/shortypro/aichatupgrade2.png",
    },
    {
      name: "Magna Hive",
      file: "magnahive-logo.png",
      url: "https://shortypro.com/shortypro/magnahive-logo.png",
    },
    {
      name: "Chatterly",
      file: "chatterly-logo.png",
      url: "https://shortypro.com/shortypro/chatterly-logo.png",
    },
    {
      name: "ViralDead Engine",
      file: "viraldeadengine-logo.png",
      url: "https://shortypro.com/shortypro/viraldeadengine-logo.png",
    },
  ];

  return (
    <div className="space-y-6">
      <Section
        title="Branding"
        desc="Approved logos, downloads, and a ready-to-ship brand kit zip."
        right={
          <a
            href="/brand-kit/shortypro-brand-kit.zip"
            className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Download Brand Kit ZIP
          </a>
        }
      >
        <div className="rounded-2xl border bg-white p-4 text-sm text-neutral-700">
          <p className="font-semibold">Quick rules</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Don’t stretch logos (keep aspect ratio).</li>
            <li>Keep padding around marks (no crowding).</li>
            <li>Use white background for dark/transparent assets.</li>
          </ul>
          <p className="mt-3">
            Public branding page (optional):{" "}
            <Link className="underline" href="/branding.html">
              /branding.html
            </Link>
          </p>
        </div>
      </Section>

      <Section title="Corporate" desc="Company-level assets.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {corporate.map((l) => (
            <LogoTile key={l.file} logo={l} />
          ))}
        </div>
      </Section>

      <Section title="Products" desc="DBA product logos.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((l) => (
            <LogoTile key={l.file} logo={l} />
          ))}
        </div>
      </Section>
    </div>
  );
}
