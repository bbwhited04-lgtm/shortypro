import ShareButtons from "@/components/ShareButtons";

export default function BioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bio</h1>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 text-slate-200">
        <p className="text-slate-300">
          ShortyPro is a clean distribution layer for short-form content and brand presence.
          Built with a modern stack that’s easy to deploy and expand.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-300">
          <li>Modern UI and clear navigation</li>
          <li>Dashboard + profile</li>
          <li>Social links + share flows</li>
          <li>Backend API powered by FastAPI + Postgres</li>
        </ul>
        <div className="mt-6">
          <ShareButtons title="ShortyPro Bio" />
        </div>
      </div>
    </div>
  );
}
