"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

type Thread = {
  id: string;
  title: string;
  createdAt: number;
};

const MODELS = [
  { id: "gpt-4o", label: "GPT-4o (recommended)" },
  { id: "gpt-4.1", label: "GPT-4.1" },
  { id: "gpt-4.1-mini", label: "GPT-4.1 mini (fast)" },
  { id: "gpt-3.5-turbo", label: "GPT-3.5 turbo (cheap)" },
] as const;

export default function ChatterlyPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  // NEW: model selector
  const [model, setModel] = useState<(typeof MODELS)[number]["id"]>("gpt-4o");

  const listRef = useRef<HTMLDivElement | null>(null);

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId),
    [threads, activeThreadId]
  );

  useEffect(() => {
    // Create a default thread on first load
    if (threads.length === 0) {
      const id = crypto.randomUUID();
      const t: Thread = { id, title: "New chat", createdAt: Date.now() };
      setThreads([t]);
      setActiveThreadId(id);
      setMessages([]);
    }
  }, [threads.length]);

  useEffect(() => {
    // scroll to bottom
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function newThread() {
    const id = crypto.randomUUID();
    const t: Thread = { id, title: "New chat", createdAt: Date.now() };
    setThreads((prev) => [t, ...prev]);
    setActiveThreadId(id);
    setMessages([]);
    setInput("");
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    setBusy(true);
    setInput("");

    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/chatterly/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: activeThreadId,
          message: text,
          model, // ✅ send selected model
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };

      if (!res.ok || !data.reply) {
        throw new Error(data.error || "Chat failed");
      }

      const botMsg: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);

      // update thread title if still default
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId && t.title === "New chat"
            ? { ...t, title: text.slice(0, 36) + (text.length > 36 ? "…" : "") }
            : t
        )
      );
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `⚠️ ${e?.message || "Error"}`,
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[75vh] w-full rounded-3xl bg-zinc-950 text-zinc-100 border border-zinc-800 p-4">
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Sidebar */}
        <aside className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
              <Image
                src="/shortypro/chatterly-logo.png"
                alt="Chatterly"
                fill
                priority
                className="object-contain p-1"
              />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">Chatterly</div>
              <div className="text-xs text-zinc-400">Hooks • captions • replies</div>
            </div>
          </div>

          <button
            type="button"
            onClick={newThread}
            className="mt-4 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-semibold hover:bg-zinc-800 transition"
          >
            + New Chat
          </button>

          <div className="mt-4 space-y-2">
            {threads.map((t) => {
              const active = t.id === activeThreadId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setActiveThreadId(t.id);
                    setMessages([]); // (your current behavior)
                    setInput("");
                  }}
                  className={[
                    "w-full rounded-2xl border px-3 py-2 text-left text-sm transition",
                    "border-zinc-800 hover:bg-zinc-800/60",
                    active ? "bg-zinc-800/60" : "bg-zinc-900/40",
                  ].join(" ")}
                >
                  <div className="font-semibold truncate text-zinc-100">{t.title}</div>
                  <div className="text-xs text-zinc-400">{new Date(t.createdAt).toLocaleString()}</div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4 flex flex-col min-h-[70vh]">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-zinc-100">
                {activeThread?.title ?? "Chat"}
              </div>
              <div className="text-xs text-zinc-400">
                Ask for hooks, captions, scripts, replies, CTAs.
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-zinc-400">{busy ? "Thinking…" : "Ready"}</span>

              {/* Model selector */}
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="hidden sm:inline">Model</span>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as any)}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none hover:bg-zinc-900"
                >
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="mt-4 flex-1 overflow-auto rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3"
          >
            {messages.length === 0 ? (
              <div className="text-sm text-zinc-400">
                Try: “Write 10 hooks for a Shorty Pro demo video.”
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={[
                    "rounded-2xl border p-3",
                    "border-zinc-800",
                    m.role === "user" ? "bg-zinc-900/60" : "bg-zinc-950/40",
                  ].join(" ")}
                >
                  <div className="text-xs text-zinc-400 mb-1">
                    {m.role === "user" ? "You" : "Chatterly"}
                  </div>
                  <div className="text-sm whitespace-pre-wrap text-zinc-100">
                    {m.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-600"
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={busy || input.trim().length === 0}
              className="rounded-2xl border border-zinc-800 bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500 transition disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              Send
            </button>
          </div>

          <div className="mt-2 text-[11px] text-zinc-500">
            Current model: <span className="text-zinc-300">{model}</span>
          </div>
        </section>
      </div>
    </div>
  );
}
