"use client";

type Props = {
  title: string;
  text?: string;
};

export default function ShareButtons({ title, text }: Props) {
  const url = typeof window !== "undefined" ? window.location.href : "";

  async function nativeShare() {
    if (typeof navigator === "undefined") return;
    // @ts-ignore
    if (navigator.share) {
      // @ts-ignore
      await navigator.share({ title, text: text || title, url });
      return;
    }
    await copy();
  }

  async function copy() {
    await navigator.clipboard.writeText(url);
    alert("Link copied!");
  }

  function xShare() {
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      (text || title) + " " + url
    )}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  function fbShare() {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={nativeShare} className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold hover:bg-sky-500">
        Share
      </button>
      <button onClick={copy} className="rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700">
        Copy Link
      </button>
      <button onClick={xShare} className="rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700">
        Post to X
      </button>
      <button onClick={fbShare} className="rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700">
        Share Facebook
      </button>
    </div>
  );
}
