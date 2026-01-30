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

export default function ChatterlyPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

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
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
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
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      {/* Sidebar */}
      <aside className="rounded-3xl border p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image
              src="/shortypro/chatterly-logo.png"
              alt="Chatterly"
              fill
              priority
              className="object-contain"
            />
          </div>
          <div>
            <div className="text-lg font-bold">Chatterly</div>
            <div className="text-xs text-muted-foreground">
              Hooks • captions • replies
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={newThread}
          className="mt-4 w-full rounded-2xl border px-4 py-2 text-sm font-semibold hover:bg-muted transition"
        >
          + New Chat
        </button>

        <div className="mt-4 space-y-2">
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveThreadId(t.id);
                setMessages([]);
              }}
              className={`w-full rounded-2xl border px-3 py-2 text-left text-sm hover:bg-muted transition ${
                t.id === activeThreadId ? "bg-muted" : ""
              }`}
            >
              <div className="font-semibold truncate">{t.title}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(t.createdAt).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <section className="rounded-3xl border p-4 flex flex-col min-h-[70vh]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold">{activeThread?.title ?? "Chat"}</div>
            <div className="text-xs text-muted-foreground">
              Ask for hooks, captions, scripts, replies, CTAs.
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {busy ? "Thinking…" : "Ready"}
          </span>
        </div>

        <div
          ref={listRef}
          className="mt-4 flex-1 overflow-auto rounded-2xl border p-4 space-y-3 bg-background/50"
        >
          {messages.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Try: “Write 10 hooks for a Shorty Pro demo video.”
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-2xl border p-3 ${
                  m.role === "user" ? "bg-muted/50" : ""
                }`}
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {m.role === "user" ? "You" : "Chatterly"}
                </div>
                <div className="text-sm whitespace-pre-wrap">{m.content}</div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-2xl border px-3 py-3 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          <button
            type="button"
            onClick={send}
            disabled={busy || input.trim().length === 0}
            className="rounded-2xl border px-4 py-3 text-sm font-semibold hover:bg-muted transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
}
