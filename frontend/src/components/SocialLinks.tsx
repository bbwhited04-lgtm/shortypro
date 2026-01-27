import { ENV } from "@/lib/env";

function Icon({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800">
      {label}
    </span>
  );
}

export default function SocialLinks() {
  const items = [
    ["YouTube", ENV.SOCIAL.youtube],
    ["Facebook", ENV.SOCIAL.facebook],
    ["Instagram", ENV.SOCIAL.instagram],
    ["Threads", ENV.SOCIAL.threads],
    ["X", ENV.SOCIAL.x],
    ["TikTok", ENV.SOCIAL.tiktok],
    ["LinkedIn", ENV.SOCIAL.linkedin],
  ].filter(([, url]) => Boolean(url)) as Array<[string, string]>;

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([label, url]) => (
        <a key={label} href={url} target="_blank" rel="noreferrer" className="no-underline">
          <Icon label={label} />
        </a>
      ))}
    </div>
  );
}
