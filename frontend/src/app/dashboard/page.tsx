"use client";

import { useEffect, useState } from "react";
import SocialLinks from "@/components/SocialLinks";

type Profile = { user_id: string; display_name?: string | null; bio?: string | null };

export default function DashboardPage() {
  const [me, setMe] = useState<{ email: string; user_id: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [display_name, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      const d = await r.json().catch(() => ({}));
      if (r.ok) setMe({ email: d.email, user_id: d.user_id });
      const p = await fetch("/api/profile", { cache: "no-store" });
      const pd = await p.json().catch(() => ({}));
      if (p.ok) {
        setProfile(pd);
        setDisplayName(pd.display_name || "");
        setBio(pd.bio || "");
      }
    })();
  }, []);

  async function save() {
    setSaving(true);
    const r = await fetch("/api/profile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ display_name, bio }),
    });
    const d = await r.json().catch(() => ({}));
    setSaving(false);
    if (r.ok) setProfile(d);
    else alert("Save failed");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="text-sm text-slate-400">
            {me ? <>Signed in as <span className="text-slate-200">{me.email}</span></> : "Loading..."}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={logout} className="rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700">Log out</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <div className="text-lg font-semibold">Profile</div>
          <div>
            <label className="text-sm text-slate-300">Display name</label>
            <input value={display_name} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2" />
          </div>
          <button disabled={saving} onClick={save} className="rounded-lg bg-emerald-500 px-3 py-2 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <div className="text-lg font-semibold">Social</div>
          <div className="text-sm text-slate-300">
            These links are env-driven — update Vercel env vars any time and they update site-wide.
          </div>
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}
