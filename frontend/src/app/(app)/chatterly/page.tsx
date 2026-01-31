"use client";

import { useState } from "react";

type Role = "user" | "assistant";
type Msg = { role: Role; content: string };



export default function ChatterlyPage() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Morning ☕ — say something and I’ll reply." },
  ]);
  const [loading, setLoading] = useState(false);

  async function send() {
  const text = input.trim();
  if (!text || loading) return;

  const userMsg: Msg = { role: "user", content: text };
  const next: Msg[] = [...msgs, userMsg];
  setMsgs(next);

  setInput("");
  setLoading(true);

  try {
    const res = await fetch("/api/chatterly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    const reply = String(data?.reply ?? data?.message ?? "OK");

    const botMsg: Msg = { role: "assistant", content: reply };
    setMsgs([...next, botMsg]);
  } catch (e: any) {
    const errMsg: Msg = {
      role: "assistant",
      content: `❌ ${e?.message ?? "Request failed"}`,
    };
    setMsgs([...next, errMsg]);
  } finally {
    setLoading(false);
  }
}


  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Chatterly</h1>
      <p style={{ opacity: 0.75, marginTop: 6 }}>
        Simple chat UI → hits <code>/api/chatterly</code> → forwards to Render.
      </p>

      <div
        style={{
          marginTop: 16,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 12,
          height: 420,
          overflow: "auto",
          background: "white",
        }}
      >
        {msgs.map((m, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              {m.role === "user" ? "You" : "Chatterly"}
            </div>
            <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Type a message…"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
          }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>
    </main>
  );
}
